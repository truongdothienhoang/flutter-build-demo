import 'package:flutter/material.dart';

void main() {
  runApp(const DogApp());
}

class Dog {
  String name;
  int age;
  String color;

  Dog({required this.name, required this.age, required this.color});
}

class DogApp extends StatelessWidget {
  const DogApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: DogHomePage(),
    );
  }
}

class DogHomePage extends StatefulWidget {
  @override
  _DogHomePageState createState() => _DogHomePageState();
}

class _DogHomePageState extends State<DogHomePage> {
  final List<Dog> dogs = [];
  final nameController = TextEditingController();
  final ageController = TextEditingController();
  final colorController = TextEditingController();

  void _addDog() {
    setState(() {
      dogs.add(Dog(
        name: nameController.text,
        age: int.tryParse(ageController.text) ?? 0,
        color: colorController.text,
      ));
      nameController.clear();
      ageController.clear();
      colorController.clear();
    });
  }

  void _deleteDog(int index) {
    setState(() {
      dogs.removeAt(index);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Dog Manager')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: nameController,
              decoration: const InputDecoration(labelText: 'Name'),
            ),
            TextField(
              controller: ageController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Age'),
            ),
            TextField(
              controller: colorController,
              decoration: const InputDecoration(labelText: 'Color'),
            ),
            ElevatedButton(
              onPressed: _addDog,
              child: const Text('Add Dog'),
            ),
            const SizedBox(height: 20),
            Expanded(
              child: ListView.builder(
                itemCount: dogs.length,
                itemBuilder: (context, index) {
                  final dog = dogs[index];
                  return ListTile(
                    title: Text('${dog.name}, ${dog.age} years old, ${dog.color}'),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete),
                      onPressed: () => _deleteDog(index),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}