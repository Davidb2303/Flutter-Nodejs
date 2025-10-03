import 'user.dart';

class Match {
  final int id;
  final User user;
  final DateTime createdAt;
  final LastMessage? lastMessage;

  Match({
    required this.id,
    required this.user,
    required this.createdAt,
    this.lastMessage,
  });

  factory Match.fromJson(Map<String, dynamic> json) {
    return Match(
      id: json['id'] ?? 0,
      user: User.fromJson(json['user'] ?? {}),
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
      lastMessage: json['lastMessage'] != null 
          ? LastMessage.fromJson(json['lastMessage'])
          : null,
    );
  }
}

class LastMessage {
  final String content;
  final DateTime createdAt;
  final bool isFromMe;

  LastMessage({
    required this.content,
    required this.createdAt,
    required this.isFromMe,
  });

  factory LastMessage.fromJson(Map<String, dynamic> json) {
    return LastMessage(
      content: json['content'] ?? '',
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
      isFromMe: json['isFromMe'] ?? false,
    );
  }
}