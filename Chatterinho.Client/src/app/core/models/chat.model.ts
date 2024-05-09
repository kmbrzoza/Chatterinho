export type SetNickForm = {
    nick: string | null;
};

export type NewChatMessage = {
    nick: string;
    message: string;
};

export type ReceivedChatMessage = {
    nick: string;
    message: string;
    date: Date;
};

export type ChatMessageForm = {
    message: string;
};
