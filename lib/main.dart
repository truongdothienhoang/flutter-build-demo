import 'package:flutter/material.dart';
import 'dart:html' as html;
import 'dart:ui' as ui;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: CameraWeb(),
    );
  }
}

class CameraWeb extends StatelessWidget {
  const CameraWeb({super.key});

  @override
  Widget build(BuildContext context) {
    final video = html.VideoElement()
      ..width = 640
      ..height = 480
      ..autoplay = true;

    html.window.navigator.mediaDevices?.getUserMedia({'video': true}).then((stream) {
      video.srcObject = stream;
    });

    // ignore: undefined_prefixed_name
    ui.platformViewRegistry.registerViewFactory(
      'camera-view',
      (int viewId) => video,
    );

    return Scaffold(
      appBar: AppBar(title: const Text('Web Kamera')),
      body: const HtmlElementView(viewType: 'camera-view'),
    );
  }
}