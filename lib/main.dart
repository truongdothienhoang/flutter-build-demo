import 'package:flutter/material.dart';
import 'dart:html' as html;

void main() {
  runApp(const CameraApp());
}

class CameraApp extends StatelessWidget {
  const CameraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: CameraPage(),
    );
  }
}

class CameraPage extends StatefulWidget {
  const CameraPage({super.key});

  @override
  State<CameraPage> createState() => _CameraPageState();
}

class _CameraPageState extends State<CameraPage> {
  late html.VideoElement _videoElement;
  late Widget _videoWidget;

  @override
  void initState() {
    super.initState();

    _videoElement = html.VideoElement()
      ..autoplay = true
      ..style.width = '100%'
      ..style.height = '100%';

    html.window.navigator.mediaDevices?.getUserMedia({'video': true}).then((stream) {
      _videoElement.srcObject = stream;
    });

    _videoWidget = HtmlElementView(viewType: 'cameraElement');
    // ignore: undefined_prefixed_name
    html.platformViewRegistry.registerViewFactory('cameraElement', (int viewId) => _videoElement);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Kamera Ansicht')),
      body: Center(
        child: SizedBox(
          width: 640,
          height: 480,
          child: _videoWidget,
        ),
      ),
    );
  }
}