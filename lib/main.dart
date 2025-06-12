import 'package:flutter/material.dart';

void main() {
  runApp(const PatrickApp());
}

class PatrickApp extends StatelessWidget {
  const PatrickApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Patrick8',
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Welcome to Patrick8'),
        ),
        body: const Center(
          child: Text(
            'Hello, this is the Patrick8 app!',
            style: TextStyle(fontSize: 24),
          ),
        ),
      ),
    );
  }
}