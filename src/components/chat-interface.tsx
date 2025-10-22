'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { placeholderImages } from '@/lib/placeholder-images';
import { Send, Loader2 } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, Timestamp, DocumentData } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { ChatMessage } from '@/lib/types';

export type Conversation = {
  id: string; // conversationId
  peerId: string; // The other user's ID
  peerName: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  avatarId: string;
};

type ChatInterfaceProps = {
  conversations: Conversation[];
  currentUserId: string;
};

export function ChatInterface({ 
    conversations, 
    currentUserId 
}: ChatInterfaceProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    conversations[0]?.id || null
  );
  const [newMessage, setNewMessage] = useState('');
  const firestore = useFirestore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !selectedConversationId) return null;
    return query(
        collection(firestore, 'chatMessages'),
        where('conversationId', '==', selectedConversationId),
        orderBy('timestamp', 'asc')
    )
  }, [firestore, selectedConversationId]);

  const { data: messages, isLoading } = useCollection<ChatMessage>(messagesQuery);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId || !selectedConversation || !firestore) return;

    const chatMessagesCollection = collection(firestore, 'chatMessages');
    const messageData: Omit<ChatMessage, 'id'> = {
        conversationId: selectedConversationId,
        senderId: currentUserId,
        receiverId: selectedConversation.peerId, // Use peerId from conversation
        text: newMessage,
        timestamp: Timestamp.now(),
    }

    try {
        await addDocumentNonBlocking(chatMessagesCollection, messageData);
        setNewMessage('');
    } catch (error) {
        console.error("Failed to send message", error);
        // Optionally show a toast notification for error
    }
  };
  
  useEffect(() => {
    // If there are conversations and no conversation is selected, select the first one.
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  useEffect(() => {
    // Scroll to the bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight });
    }
  }, [messages]);


  return (
    <Card className="h-[calc(100vh-12rem)]">
      <div className="grid h-full grid-cols-1 md:grid-cols-3">
        {/* Conversations List */}
        <div className="flex flex-col border-r">
          <CardHeader className="p-4">
            <Input placeholder="Buscar conversas..." />
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-1 p-2">
              {conversations.map(convo => {
                const avatar = placeholderImages.find(p => p.id === convo.avatarId);
                return (
                  <button
                    key={convo.id}
                    onClick={() => setSelectedConversationId(convo.id)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent',
                      selectedConversationId === convo.id && 'bg-accent'
                    )}
                  >
                    <Avatar>
                      {avatar && <AvatarImage src={avatar.imageUrl} alt={convo.peerName} data-ai-hint={avatar.imageHint} />}
                      <AvatarFallback>{convo.peerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 truncate">
                      <p className="font-semibold">{convo.peerName}</p>
                      <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{convo.lastMessageTimestamp}</span>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className="col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader className="flex flex-row items-center gap-3 border-b p-4">
                <Avatar>
                    {(() => {
                        const avatar = placeholderImages.find(p => p.id === selectedConversation.avatarId);
                        return avatar && <AvatarImage src={avatar.imageUrl} alt={selectedConversation.peerName} data-ai-hint={avatar.imageHint} />
                    })()}
                  <AvatarFallback>{selectedConversation.peerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="font-semibold">{selectedConversation.peerName}</p>
              </CardHeader>
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                 {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                 ) : (
                    <div className="flex flex-col gap-4">
                        {messages?.map(msg => {
                            const isCurrentUser = msg.senderId === currentUserId; 
                            return (
                            <div
                                key={msg.id}
                                className={cn('flex items-end gap-2', isCurrentUser ? 'justify-end' : 'justify-start')}
                            >
                                {!isCurrentUser && <Avatar className="h-6 w-6"><AvatarFallback>{selectedConversation.peerName.charAt(0)}</AvatarFallback></Avatar>}
                                <div
                                className={cn(
                                    'max-w-xs rounded-lg p-3 md:max-w-md',
                                    isCurrentUser
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                )}
                                >
                                <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                 )}
              </ScrollArea>
              <CardFooter className="border-t p-4">
                <div className="relative w-full">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </CardFooter>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-muted-foreground">{conversations.length > 0 ? "Selecione uma conversa para começar." : "Nenhuma conversa encontrada."}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
