import { useState } from 'react';
import { DoctorLayout } from '@/components/layouts/DoctorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle, Send, User, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock conversations
const mockConversations = [
  { id: 1, name: 'فاطمة أحمد', lastMessage: 'شكراً دكتور', time: '10:30 ص', unread: 2 },
  { id: 2, name: 'سارة محمد', lastMessage: 'متى موعد التحليل؟', time: 'أمس', unread: 0 },
  { id: 3, name: 'نورة علي', lastMessage: 'تم رفع النتيجة', time: 'الأحد', unread: 1 },
];

// Mock messages
const mockMessages = [
  { id: 1, sender: 'patient', text: 'السلام عليكم دكتور', time: '10:25 ص' },
  { id: 2, sender: 'doctor', text: 'وعليكم السلام، كيف حالك؟', time: '10:26 ص' },
  { id: 3, sender: 'patient', text: 'الحمد لله، أشعر بتحسن بعد الدواء', time: '10:28 ص' },
  { id: 4, sender: 'doctor', text: 'ممتاز، استمري على الدواء واتبعي التعليمات', time: '10:29 ص' },
  { id: 5, sender: 'patient', text: 'شكراً دكتور', time: '10:30 ص' },
];

export default function DoctorChatPage() {
  const { language, isRTL } = useLanguage();
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch doctor's patients
  const { data: doctor } = useQuery({
    queryKey: ['doctor', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: patients } = useQuery({
    queryKey: ['doctor-patients', doctor?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .eq('linked_doctor_id', doctor?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!doctor?.id,
  });

  const handleSend = () => {
    if (!message.trim()) return;
    // TODO: Implement real-time messaging
    setMessage('');
  };

  const selectedName = mockConversations.find(c => c.id === selectedConversation)?.name;

  return (
    <DoctorLayout>
      <div className="h-[calc(100vh-12rem)] flex gap-4">
        {/* Conversations List */}
        <Card className="w-80 flex-shrink-0 flex flex-col">
          <CardHeader className="border-b p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-2">
            {mockConversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={cn(
                  'w-full p-3 rounded-lg text-start transition-all',
                  selectedConversation === conv.id
                    ? 'bg-primary/10'
                    : 'hover:bg-secondary/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground truncate">{conv.name}</p>
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{selectedName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'متصلة' : 'Online'}
                    </p>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {mockMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex gap-3',
                        msg.sender === 'doctor' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {msg.sender === 'patient' && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={cn(
                          'max-w-[70%] rounded-2xl px-4 py-2',
                          msg.sender === 'doctor'
                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                            : 'bg-secondary text-foreground rounded-bl-sm'
                        )}
                      >
                        <p>{msg.text}</p>
                        <p className={cn(
                          'text-xs mt-1',
                          msg.sender === 'doctor' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        )}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={language === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'}
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <Button onClick={handleSend} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>{language === 'ar' ? 'اختر محادثة للبدء' : 'Select a conversation to start'}</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DoctorLayout>
  );
}
