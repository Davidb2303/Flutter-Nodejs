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
      id: json['id'],
      user: User.fromJson(json['user']),
      createdAt: DateTime.parse(json['createdAt']),
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
      content: json['content'],
      createdAt: DateTime.parse(json['createdAt']),
      isFromMe: json['isFromMe'],
    );
  }
}