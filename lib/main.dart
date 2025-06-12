import 'package:flutter/material.dart';

void main() {
  runApp(const PatrickShopApp());
}

class PatrickShopApp extends StatelessWidget {
  const PatrickShopApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Patrick Shop',
      theme: ThemeData(primarySwatch: Colors.teal),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  final List<Map<String, String>> products = const [
    {'name': 'Shoe', 'price': '\u002449.99'},
    {'name': 'Watch', 'price': '\u002479.99'},
    {'name': 'Backpack', 'price': '\u002459.99'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Patrick Shop')),
      body: ListView.builder(
        itemCount: products.length,
        itemBuilder: (context, index) {
          final product = products[index];
          return ListTile(
            title: Text(product['name']!),
            subtitle: Text(product['price']!),
            trailing: const Icon(Icons.shopping_cart),
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => ProductDetail(product: product),
              ),
            ),
          );
        },
      ),
    );
  }
}

class ProductDetail extends StatelessWidget {
  final Map<String, String> product;

  const ProductDetail({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(product['name']!)),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(product['name']!, style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 10),
            Text('Price: ${product['price']}'),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {},
              child: const Text('Add to Cart'),
            ),
          ],
        ),
      ),
    );
  }
}