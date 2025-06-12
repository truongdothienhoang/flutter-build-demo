import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text('Hello Patrick'),
          actions: [
            PopupMenuButton<String>(
              onSelected: (String value) {
                // Handle menu selection
              },
              itemBuilder: (BuildContext context) {
                return {'New', 'Shop'}.map((String choice) {
                  return PopupMenuItem<String>(
                    value: choice,
                    child: Text(choice),
                  );
                }).toList();
              },
            ),
          ],
        ),
        body: Center(
          child: Text(
            'Hello Patrick',
            style: TextStyle(fontSize: 24),
          ),
        ),
      ),
    );
  }
}