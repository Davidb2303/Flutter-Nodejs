import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../models/match.dart';
import '../models/message.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:8080/api';
  
  static Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }
  
  static Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('jwt_token', token);
  }
  
  static Future<void> _removeToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
  }
  
  static Map<String, String> _getHeaders({bool includeAuth = true}) {
    Map<String, String> headers = {
      'Content-Type': 'application/json',
    };
    return headers;
  }
  
  static Future<Map<String, String>> _getHeadersWithAuth() async {
    final token = await _getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  // AUTH ENDPOINTS
  static Future<Map<String, dynamic>> register({
    required String username,
    required String email,
    required String password,
    required String name,
    int? age,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: _getHeaders(includeAuth: false),
      body: jsonEncode({
        'username': username,
        'email': email,
        'password': password,
        'name': name,
        if (age != null) 'age': age,
      }),
    );

    final data = jsonDecode(response.body);
    
    if (response.statusCode == 201) {
      await _saveToken(data['token']);
      return data;
    } else {
      throw Exception(data['error'] ?? 'Error en el registro');
    }
  }

  static Future<Map<String, dynamic>> login({
    required String username,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: _getHeaders(includeAuth: false),
      body: jsonEncode({
        'username': username,
        'password': password,
      }),
    );

    final data = jsonDecode(response.body);
    
    if (response.statusCode == 200) {
      await _saveToken(data['token']);
      return data;
    } else {
      throw Exception(data['error'] ?? 'Error en el login');
    }
  }

  static Future<User> verifyToken() async {
    final headers = await _getHeadersWithAuth();
    final response = await http.get(
      Uri.parse('$baseUrl/auth/verify'),
      headers: headers,
    );

    final data = jsonDecode(response.body);
    
    if (response.statusCode == 200) {
      return User.fromJson(data['user']);
    } else {
      throw Exception(data['error'] ?? 'Token inválido');
    }
  }

  static Future<void> logout() async {
    await _removeToken();
  }

  // USER ENDPOINTS
  static Future<List<User>> getPotentialMatches() async {
    final headers = await _getHeadersWithAuth();
    final response = await http.get(
      Uri.parse('$baseUrl/users/potential-matches'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => User.fromJson(json)).toList();
    } else {
      final data = jsonDecode(response.body);
      throw Exception(data['error'] ?? 'Error obteniendo usuarios');
    }
  }

  static Future<User> getMyProfile() async {
    final headers = await _getHeadersWithAuth();
    final response = await http.get(
      Uri.parse('$baseUrl/users/me'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return User.fromJson(data);
    } else {
      final data = jsonDecode(response.body);
      throw Exception(data['error'] ?? 'Error obteniendo perfil');
    }
  }

  static Future<User> updateProfile({
    String? name,
    int? age,
    String? photoUrl,
    String? interests,
  }) async {
    final headers = await _getHeadersWithAuth();
    final body = <String, dynamic>{};
    if (name != null) body['name'] = name;
    if (age != null) body['age'] = age;
    if (photoUrl != null) body['photoUrl'] = photoUrl;
    if (interests != null) body['interests'] = interests;

    final response = await http.put(
      Uri.parse('$baseUrl/users/me'),
      headers: headers,
      body: jsonEncode(body),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return User.fromJson(data['user']);
    } else {
      final data = jsonDecode(response.body);
      throw Exception(data['error'] ?? 'Error actualizando perfil');
    }
  }

  // SWIPE ENDPOINTS
  static Future<Map<String, dynamic>> processSwipe({
    required int targetId,
    required bool isLike,
  }) async {
    final headers = await _getHeadersWithAuth();
    final response = await http.post(
      Uri.parse('$baseUrl/swipes'),
      headers: headers,
      body: jsonEncode({
        'targetId': targetId,
        'isLike': isLike,
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      final data = jsonDecode(response.body);
      throw Exception(data['error'] ?? 'Error procesando swipe');
    }
  }

  // MATCH ENDPOINTS
  static Future<List<Match>> getMatches() async {
    final headers = await _getHeadersWithAuth();
    final response = await http.get(
      Uri.parse('$baseUrl/matches'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Match.fromJson(json)).toList();
    } else {
      final data = jsonDecode(response.body);
      throw Exception(data['error'] ?? 'Error obteniendo matches');
    }
  }

  // MESSAGE ENDPOINTS
  static Future<Message> sendMessage({
    required int matchId,
    required String content,
  }) async {
    final headers = await _getHeadersWithAuth();
    final response = await http.post(
      Uri.parse('$baseUrl/messages'),
      headers: headers,
      body: jsonEncode({
        'matchId': matchId,
        'content': content,
      }),
    );

    if (response.statusCode == 201) {
      final data = jsonDecode(response.body);
      return Message.fromJson(data['data']);
    } else {
      final data = jsonDecode(response.body);
      throw Exception(data['error'] ?? 'Error enviando mensaje');
    }
  }

  static Future<List<Message>> getMessages(int matchId) async {
    final headers = await _getHeadersWithAuth();
    final response = await http.get(
      Uri.parse('$baseUrl/messages/match/$matchId'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Message.fromJson(json)).toList();
    } else {
      final data = jsonDecode(response.body);
      throw Exception(data['error'] ?? 'Error obteniendo mensajes');
    }
  }

  static Future<List<Conversation>> getConversations() async {
    final headers = await _getHeadersWithAuth();
    final response = await http.get(
      Uri.parse('$baseUrl/messages/conversations'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Conversation.fromJson(json)).toList();
    } else {
      final data = jsonDecode(response.body);
      throw Exception(data['error'] ?? 'Error obteniendo conversaciones');
    }
  }

  static Future<void> markAsRead(int matchId) async {
    final headers = await _getHeadersWithAuth();
    await http.put(
      Uri.parse('$baseUrl/messages/match/$matchId/read'),
      headers: headers,
    );
  }
}