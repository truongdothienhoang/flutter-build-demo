import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'IT Device Controller',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const LoginPage(),
    );
  }
}

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    final nameController = TextEditingController();
    final passwordController = TextEditingController();
    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(controller: nameController, decoration: const InputDecoration(labelText: 'Name')),
            TextField(controller: passwordController, obscureText: true, decoration: const InputDecoration(labelText: 'Password')),
            ElevatedButton(
              onPressed: () {
                Navigator.push(context, MaterialPageRoute(builder: (context) => const DashboardPage()));
              },
              child: const Text('Login'),
            ),
          ],
        ),
      ),
    );
  }
}

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  final List<String> myDevices = [];
  final deviceController = TextEditingController();

  void addDevice(String deviceId) {
    if (deviceId.length == 6) {
      setState(() {
        myDevices.add(deviceId);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Dashboard')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Add Device:'),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: deviceController,
                    decoration: const InputDecoration(hintText: 'Enter 6-digit Device ID'),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.qr_code_scanner),
                  onPressed: () {}, // QR scanner placeholder
                ),
                ElevatedButton(
                  onPressed: () => addDevice(deviceController.text),
                  child: const Text('Add'),
                ),
              ],
            ),
            const SizedBox(height: 20),
            const Text('My Devices:'),
            Expanded(
              child: ListView.builder(
                itemCount: myDevices.length,
                itemBuilder: (context, index) {
                  return ListTile(
                    title: Text('Device ${myDevices[index]}'),
                    trailing: const Icon(Icons.check_circle, color: Colors.green),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => DeviceControlPage(deviceId: myDevices[index]),
                        ),
                      );
                    },
                  );
                },
              ),
            )
          ],
        ),
      ),
    );
  }
}

class DeviceControlPage extends StatelessWidget {
  final String deviceId;
  const DeviceControlPage({super.key, required this.deviceId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Device $deviceId')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(onPressed: () {}, child: const Text('Forward')),
            ElevatedButton(onPressed: () {}, child: const Text('Backward')),
            ElevatedButton(onPressed: () {}, child: const Text('Automatic')),
          ],
        ),
      ),
    );
  }
}