import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MessageCircle, X, Mic, MicOff, Send, Volume2, VolumeX } from 'lucide-react';
import { Badge } from './ui/badge';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function VoiceChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Eu sou seu assistente virtual. Posso te ajudar a usar o sistema de monitoramento de leite. Você pode falar comigo clicando no microfone ou digitar sua pergunta.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = (text: string) => {
    if (!audioEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const getBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    if (msg.includes('ola') || msg.includes('olá') || msg.includes('oi') || msg.includes('bom dia') || msg.includes('boa tarde')) {
      return 'Olá! Como posso te ajudar hoje?';
    }

    if (msg.includes('cadastrar vaca') || msg.includes('adicionar vaca') || msg.includes('nova vaca') || msg.includes('registrar vaca')) {
      return 'Para cadastrar uma nova vaca: 1) Clique na aba "Vacas" no topo da tela, 2) Clique no botão verde "Nova Vaca", 3) Preencha o nome, número do brinco, raça, data de nascimento e status. Depois é só clicar em cadastrar!';
    }

    if (msg.includes('registrar') && (msg.includes('leite') || msg.includes('análise') || msg.includes('qualidade'))) {
      return 'Para registrar uma análise de qualidade do leite: 1) Vá na aba "Registrar", 2) Selecione a vaca, 3) Escolha a data, 4) Preencha os dados como volume em litros, gordura, proteína, lactose, CCS (contagem de células), temperatura e pH. Clique em "Registrar Análise" para salvar.';
    }

    if (msg.includes('dashboard') || msg.includes('gráfico') || msg.includes('relatório') || msg.includes('ver') && msg.includes('dados')) {
      return 'O Dashboard mostra todos os dados da produção! Você verá: número de vacas ativas, volume total de leite, médias de gordura e proteína, e a qualidade (CCS). Os gráficos mostram a produção de cada vaca e a evolução da qualidade ao longo do tempo.';
    }

    if (msg.includes('ccs') || msg.includes('células') || msg.includes('qualidade')) {
      return 'CCS significa Contagem de Células Somáticas, que mede a qualidade do leite. Valores abaixo de 200 mil/ml são excelentes, entre 200 e 400 são bons, e acima de 400 precisam de atenção, pois podem indicar problemas de saúde no animal.';
    }

    if (msg.includes('gordura') || msg.includes('proteína') || msg.includes('lactose')) {
      return 'Esses são os componentes principais do leite! A gordura normalmente fica entre 3-5%, a proteína entre 3-4%, e a lactose entre 4-5%. Valores muito baixos podem indicar problemas nutricionais ou de saúde da vaca.';
    }

    if (msg.includes('temperatura')) {
      return 'A temperatura ideal do leite resfriado deve estar entre 2°C e 4°C. Temperaturas mais altas podem comprometer a qualidade e favorecer o crescimento de bactérias.';
    }

    if (msg.includes('ph')) {
      return 'O pH normal do leite fresco fica entre 6.6 e 6.8. Valores fora dessa faixa podem indicar leite ácido ou adulterado.';
    }

    if (msg.includes('editar') || msg.includes('alterar') || msg.includes('mudar')) {
      return 'Para editar informações de uma vaca, vá na aba "Vacas", encontre a vaca na tabela e clique no ícone de lápis (editar). Faça as alterações necessárias e clique em "Atualizar".';
    }

    if (msg.includes('excluir') || msg.includes('deletar') || msg.includes('remover')) {
      return 'Para excluir uma vaca, vá na aba "Vacas", encontre a vaca na tabela e clique no ícone de lixeira. Atenção: isso também vai remover todos os registros de qualidade dessa vaca!';
    }

    if (msg.includes('ajuda') || msg.includes('como') || msg.includes('usar')) {
      return 'Posso te ajudar com: cadastrar vacas, registrar análises de qualidade, entender os gráficos do dashboard, explicar o que é CCS, gordura, proteína, temperatura e pH. O que você gostaria de saber?';
    }

    if (msg.includes('obrigado') || msg.includes('obrigada') || msg.includes('valeu')) {
      return 'Por nada! Estou aqui para ajudar sempre que precisar. Basta me chamar!';
    }

    return 'Desculpe, não entendi sua pergunta. Posso te ajudar a: cadastrar vacas, registrar análises de leite, entender os dados do dashboard, ou explicar sobre CCS, gordura, proteína e outros parâmetros. O que você precisa?';
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      const botResponse = getBotResponse(messageText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      speak(botResponse);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg bg-green-600 hover:bg-green-700 z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <div>
                <h3>Assistente Virtual</h3>
                <p className="text-xs opacity-90">Estou aqui para ajudar!</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAudioEnabled(!audioEnabled);
                  if (!audioEnabled) {
                    stopSpeaking();
                  }
                }}
                className="text-white hover:bg-green-700 h-8 w-8 p-0"
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-green-700 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isSpeaking && (
              <div className="flex justify-start">
                <Badge variant="secondary" className="animate-pulse">
                  <Volume2 className="w-3 h-3 mr-1" />
                  Falando...
                </Badge>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-white rounded-b-lg">
            {isListening && (
              <div className="mb-2 flex items-center justify-center">
                <Badge variant="default" className="animate-pulse bg-red-500">
                  <Mic className="w-3 h-3 mr-1" />
                  Ouvindo...
                </Badge>
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1"
                disabled={isListening}
              />
              <Button
                onClick={isListening ? stopListening : startListening}
                className={`${
                  isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button
                onClick={() => handleSendMessage()}
                className="bg-green-600 hover:bg-green-700"
                disabled={!inputText.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Clique no microfone para falar ou digite sua pergunta
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
