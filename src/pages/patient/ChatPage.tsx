import { useState } from 'react';
import { PatientLayout } from '@/components/layouts/PatientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle, Send, User, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock messages for now - will be replaced with real-time chat
const mockMessages = [
  { id: 1, sender: 'doctor', text: 'مرحباً، كيف حالك اليوم؟', time: '10:30 ص' },
  { id: 2, sender: 'patient', text: 'الحمد لله، أشعر بتحسن', time: '10:32 ص' },
  { id: 3, sender: 'doctor', text: 'هل تناولتِ الأدوية بانتظام؟', time: '10:33 ص' },
  { id: 4, sender: 'patient', text: 'نعم دكتور', time: '10:35 ص' },
];

export default function ChatPage() {
  const { isRTL } = useLanguage();
  const { user, profile } = useAuth();
  const [message, setMessage] = useState('');

  // Fetch patient's linked doctor
  const { data: patient } = useQuery({
    queryKey: ['patient-with-doctor', user?.id],
    queryFn: async () => {
      const { data: patientData, error } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      if (error) throw error;
      
      if (patientData?.linked_doctor_id) {
        const { data: doctorData } = await supabase
          .from('doctors')
          .select('id, specialty, user_id')
          .eq('id', patientData.linked_doctor_id)
          .single();
        
        if (doctorData) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', doctorData.user_id)
            .single();
          return { ...patientData, doctor_name: profile?.full_name };
        }
      }
      return patientData;
    },
    enabled: !!user?.id,
  });

  const doctorName = patient?.doctor_name || (isRTL ? 'الطبيب' : 'Doctor');
  const hasDoctor = !!patient?.linked_doctor_id;

  const handleSend = () => {
    if (!message.trim()) return;
    // TODO: Implement real-time messaging
    setMessage('');
  };

  return (
    <PatientLayout>
      <div className="h-[calc(100vh-12rem)] flex flex-col">
        {/* Header */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{doctorName}</h2>
                <p className="text-sm text-muted-foreground">
                  {hasDoctor 
                    ? (isRTL ? 'متصل' : 'Online')
                    : (isRTL ? 'لم يتم الربط بطبيب بعد' : 'Not linked to a doctor yet')
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="h-5 w-5 text-primary" />
              {isRTL ? 'المحادثة' : 'Chat'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4">
            {!hasDoctor ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <MessageCircle className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {isRTL ? 'لم يتم الربط بطبيب' : 'No Doctor Linked'}
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  {isRTL 
                    ? 'يرجى ربط حسابك بطبيبك باستخدام كود الطبيب للبدء في المحادثة'
                    : 'Please link your account with your doctor using their code to start chatting'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {mockMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex gap-3',
                      msg.sender === 'patient' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {msg.sender === 'doctor' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Stethoscope className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[70%] rounded-2xl px-4 py-2',
                        msg.sender === 'patient'
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-secondary text-foreground rounded-bl-sm'
                      )}
                    >
                      <p>{msg.text}</p>
                      <p className={cn(
                        'text-xs mt-1',
                        msg.sender === 'patient' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      )}>
                        {msg.time}
                      </p>
                    </div>
                    {msg.sender === 'patient' && (
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-accent" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          {/* Input Area */}
          {hasDoctor && (
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isRTL ? 'اكتبي رسالتك...' : 'Type your message...'}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button onClick={handleSend} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </PatientLayout>
  );
}
