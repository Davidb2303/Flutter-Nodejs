import 'user.dart';

class Message {
  final int id;
  final int matchId;
  final int senderId;
  final int receiverId;
  final String content;
  final DateTime createdAt;
  final DateTime? readAt;
  final User sender;

  Message({
    required this.id,
    required this.matchId,
    required this.senderId,
    required this.receiverId,
    required this.content,
    required this.createdAt,
    this.readAt,
    required this.sender,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['id'] ?? 0,
      matchId: json['matchId'] ?? 0,
      senderId: json['senderId'] ?? 0,
      receiverId: json['receiverId'] ?? 0,
      content: json['content'] ?? '',
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
      readAt: json['readAt'] != null ? DateTime.parse(json['readAt']) : null,
      sender: User.fromJson(json['sender'] ?? {}),
    );
  }
}

class Conversation {
  final int matchId;
  final User user;
  final LastMessage lastMessage;
  final DateTime updatedAt;

  Conversation({
    required this.matchId,
    required this.user,
    required this.lastMessage,
    required this.updatedAt,
  });

  factory Conversation.fromJson(Map<String, dynamic> json) {
    return Conversation(
      matchId: json['matchId'] ?? 0,
      user: User.fromJson(json['user'] ?? {}),
      lastMessage: LastMessage.fromJson(json['lastMessage'] ?? {}),
      updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : DateTime.now(),
    );
  }
}

class LastMessage {
  final String content;
  final DateTime createdAt;
  final bool isFromMe;
  final bool isRead;

  LastMessage({
    required this.content,
    required this.createdAt,
    required this.isFromMe,
    required this.isRead,
  });

  factory LastMessage.fromJson(Map<String, dynamic> json) {
    return LastMessage(
      content: json['content'] ?? '',
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
      isFromMe: json['isFromMe'] ?? false,
      isRead: json['isRead'] ?? false,
    );
  }
}