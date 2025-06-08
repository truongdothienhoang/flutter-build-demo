import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  void _handleButtonClick(String label) {
    print('Button ' + label + ' clicked');
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Two Button App')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton(
                onPressed: () => _handleButtonClick('1'),
                child: const Text('Button 1'),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () => _handleButtonClick('2'),
                child: const Text('Button 2'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}