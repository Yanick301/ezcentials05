#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script pour générer 50 produits pour chaque sous-catégorie
Total: 16 sous-catégories x 50 = 800 produits
"""

import json
import random

# Définitions des sous-catégories
subcategories_config = {
    'mens-clothing': {
        'chemises-homme': {
            'name_de': 'Chemise', 'name_fr': 'Chemise', 'name_en': 'Shirt',
            'sizes': ['S', 'M', 'L', 'XL', 'XXL'],
            'base_price_range': (45, 250),
            'variants': ['Classique', 'Oxford', 'Formelle', 'Décontractée', 'Designer', 'Premium', 'Luxe', 'Élégante', 'Moderne', 'Vintage']
        },
        'pantalons-homme': {
            'name_de': 'Hose', 'name_fr': 'Pantalon', 'name_en': 'Trousers',
            'sizes': ['30', '32', '34', '36', '38', '40', '42'],
            'base_price_range': (60, 350),
            'variants': ['Chino', 'Jeans', 'Formel', 'Décontracté', 'Designer', 'Premium', 'Luxe', 'Élégant', 'Moderne', 'Classique']
        },
        'vestes-homme': {
            'name_de': 'Jacke', 'name_fr': 'Veste', 'name_en': 'Jacket',
            'sizes': ['S', 'M', 'L', 'XL', 'XXL'],
            'base_price_range': (80, 600),
            'variants': ['Blazer', 'Bomber', 'Manteau', 'Designer', 'Premium', 'Luxe', 'Élégante', 'Moderne', 'Classique', 'Sport']
        },
        'pulls-homme': {
            'name_de': 'Pullover', 'name_fr': 'Pull', 'name_en': 'Sweater',
            'sizes': ['S', 'M', 'L', 'XL', 'XXL'],
            'base_price_range': (50, 300),
            'variants': ['Cachemire', 'Laine', 'Coton', 'Designer', 'Premium', 'Luxe', 'Élégant', 'Moderne', 'Classique', 'Décontracté']
        },
        'accessoires-homme': {
            'name_de': 'Accessoire', 'name_fr': 'Accessoire', 'name_en': 'Accessory',
            'sizes': ['Unique', 'One Size'],
            'base_price_range': (20, 200),
            'variants': ['Cravate', 'Ceinture', 'Portefeuille', 'Montre', 'Lunettes', 'Écharpe', 'Gants', 'Chapeau', 'Bracelet', 'Bague']
        },
        'chaussures-homme': {
            'name_de': 'Schuhe', 'name_fr': 'Chaussures', 'name_en': 'Shoes',
            'sizes': ['40', '41', '42', '43', '44', '45', '46'],
            'base_price_range': (80, 500),
            'variants': ['Derby', 'Oxford', 'Baskets', 'Bottes', 'Mocassins', 'Designer', 'Premium', 'Luxe', 'Élégantes', 'Sport']
        }
    },
    'womens-clothing': {
        'robes-femme': {
            'name_de': 'Kleid', 'name_fr': 'Robe', 'name_en': 'Dress',
            'sizes': ['XS', 'S', 'M', 'L', 'XL'],
            'base_price_range': (60, 400),
            'variants': ['Soirée', 'Cocktail', 'Midi', 'Maxi', 'Designer', 'Premium', 'Luxe', 'Élégante', 'Moderne', 'Classique']
        },
        'tops-femme': {
            'name_de': 'Top', 'name_fr': 'Top', 'name_en': 'Top',
            'sizes': ['XS', 'S', 'M', 'L', 'XL'],
            'base_price_range': (30, 200),
            'variants': ['Blouse', 'T-shirt', 'Chemisier', 'Débardeur', 'Designer', 'Premium', 'Luxe', 'Élégant', 'Moderne', 'Décontracté']
        },
        'pantalons-femme': {
            'name_de': 'Hose', 'name_fr': 'Pantalon', 'name_en': 'Trousers',
            'sizes': ['36', '38', '40', '42', '44'],
            'base_price_range': (50, 350),
            'variants': ['Tailleur', 'Jeans', 'Legging', 'Designer', 'Premium', 'Luxe', 'Élégant', 'Moderne', 'Classique', 'Décontracté']
        },
        'jupes-femme': {
            'name_de': 'Rock', 'name_fr': 'Jupe', 'name_en': 'Skirt',
            'sizes': ['XS', 'S', 'M', 'L', 'XL'],
            'base_price_range': (40, 250),
            'variants': ['Crayon', 'A-line', 'Midi', 'Mini', 'Designer', 'Premium', 'Luxe', 'Élégante', 'Moderne', 'Classique']
        },
        'vestes-femme': {
            'name_de': 'Jacke', 'name_fr': 'Veste', 'name_en': 'Jacket',
            'sizes': ['XS', 'S', 'M', 'L', 'XL'],
            'base_price_range': (70, 500),
            'variants': ['Blazer', 'Manteau', 'Veste', 'Designer', 'Premium', 'Luxe', 'Élégante', 'Moderne', 'Classique', 'Sport']
        },
        'accessoires-femme': {
            'name_de': 'Accessoire', 'name_fr': 'Accessoire', 'name_en': 'Accessory',
            'sizes': ['Unique', 'One Size'],
            'base_price_range': (25, 300),
            'variants': ['Sac', 'Portefeuille', 'Montre', 'Lunettes', 'Bijoux', 'Écharpe', 'Gants', 'Chapeau', 'Bracelet', 'Collier']
        }
    },
    'winter-clothing': {
        'printemps': {
            'name_de': 'Frühling', 'name_fr': 'Printemps', 'name_en': 'Spring',
            'sizes': ['S', 'M', 'L', 'XL'],
            'base_price_range': (40, 300),
            'variants': ['Léger', 'Coloré', 'Floral', 'Pastel', 'Designer', 'Premium', 'Luxe', 'Élégant', 'Moderne', 'Classique']
        },
        'ete': {
            'name_de': 'Sommer', 'name_fr': 'Été', 'name_en': 'Summer',
            'sizes': ['S', 'M', 'L', 'XL'],
            'base_price_range': (35, 280),
            'variants': ['Léger', 'Aéré', 'Coton', 'Lin', 'Designer', 'Premium', 'Luxe', 'Élégant', 'Moderne', 'Décontracté']
        },
        'automne': {
            'name_de': 'Herbst', 'name_fr': 'Automne', 'name_en': 'Autumn',
            'sizes': ['S', 'M', 'L', 'XL'],
            'base_price_range': (50, 350),
            'variants': ['Chaud', 'Laine', 'Cachemire', 'Doux', 'Designer', 'Premium', 'Luxe', 'Élégant', 'Moderne', 'Classique']
        },
        'hiver': {
            'name_de': 'Winter', 'name_fr': 'Hiver', 'name_en': 'Winter',
            'sizes': ['S', 'M', 'L', 'XL'],
            'base_price_range': (60, 450),
            'variants': ['Chaud', 'Doudoune', 'Laine', 'Cachemire', 'Designer', 'Premium', 'Luxe', 'Élégant', 'Moderne', 'Classique']
        }
    }
}

# Couleurs disponibles
colors_list = [
    {'name_de': 'Schwarz', 'name_fr': 'Noir', 'name_en': 'Black'},
    {'name_de': 'Weiß', 'name_fr': 'Blanc', 'name_en': 'White'},
    {'name_de': 'Grau', 'name_fr': 'Gris', 'name_en': 'Gray'},
    {'name_de': 'Navy', 'name_fr': 'Bleu marine', 'name_en': 'Navy'},
    {'name_de': 'Beige', 'name_fr': 'Beige', 'name_en': 'Beige'},
    {'name_de': 'Braun', 'name_fr': 'Marron', 'name_en': 'Brown'},
    {'name_de': 'Rot', 'name_fr': 'Rouge', 'name_en': 'Red'},
    {'name_de': 'Blau', 'name_fr': 'Bleu', 'name_en': 'Blue'},
    {'name_de': 'Grün', 'name_fr': 'Vert', 'name_en': 'Green'},
    {'name_de': 'Rosa', 'name_fr': 'Rose', 'name_en': 'Pink'},
    {'name_de': 'Bordeauxrot', 'name_fr': 'Bordeaux', 'name_en': 'Burgundy'},
    {'name_de': 'Weinrot', 'name_fr': 'ROUGE AU VIN', 'name_en': 'Wine red'},
]

def generate_product_name(variant, subcat_config, index):
    """Génère un nom de produit"""
    base_name = subcat_config['name_de']
    variant_name = variant
    
    # Noms en allemand
    name_de = f"{variant_name} {base_name}"
    if index > 0:
        name_de = f"{variant_name} {base_name} {index+1}"
    
    # Noms en français
    name_fr = f"{variant_name} {subcat_config['name_fr']}"
    if index > 0:
        name_fr = f"{variant_name} {subcat_config['name_fr']} {index+1}"
    
    # Noms en anglais
    name_en = f"{variant_name} {subcat_config['name_en']}"
    if index > 0:
        name_en = f"{variant_name} {subcat_config['name_en']} {index+1}"
    
    return name_de, name_fr, name_en

def generate_slug(name_de):
    """Génère un slug à partir du nom"""
    slug = name_de.lower()
    slug = slug.replace('ä', 'ae').replace('ö', 'oe').replace('ü', 'ue').replace('ß', 'ss')
    slug = slug.replace(' ', '-').replace('é', 'e').replace('è', 'e').replace('ê', 'e')
    slug = ''.join(c if c.isalnum() or c == '-' else '' for c in slug)
    return slug

def generate_description(name_de, name_fr, name_en, variant, subcat_config):
    """Génère une description pour le produit"""
    desc_de = f"Ein hochwertiger {name_de.lower()} aus erstklassigen Materialien. Perfekt für jeden Anlass, kombiniert dieser {variant.lower()} Stil mit außergewöhnlichem Komfort. Ein Muss für jeden modischen Kleiderschrank."
    desc_fr = f"Un {name_fr.lower()} de qualité supérieure en matériaux de première classe. Parfait pour toutes les occasions, ce style {variant.lower()} allie élégance et confort exceptionnel. Un incontournable pour toute garde-robe moderne."
    desc_en = f"A high-quality {name_en.lower()} made from first-class materials. Perfect for any occasion, this {variant.lower()} style combines elegance with exceptional comfort. A must-have for any modern wardrobe."
    return desc_de, desc_fr, desc_en

def generate_product(category, subcategory, subcat_config, index):
    """Génère un produit unique"""
    variant = subcat_config['variants'][index % len(subcat_config['variants'])]
    name_de, name_fr, name_en = generate_product_name(variant, subcat_config, index)
    slug = generate_slug(name_de)
    desc_de, desc_fr, desc_en = generate_description(name_de, name_fr, name_en, variant, subcat_config)
    
    # Prix
    min_price, max_price = subcat_config['base_price_range']
    price = random.randint(min_price, max_price)
    old_price = None
    if random.random() < 0.3:  # 30% des produits en promo
        old_price = int(price * random.uniform(1.2, 1.5))
    
    # Couleurs (1-3 couleurs par produit)
    num_colors = random.randint(1, 3)
    selected_colors = random.sample(colors_list, min(num_colors, len(colors_list)))
    
    # Image name
    image_name = slug.replace('-', '_')
    
    product = {
        'id': f'{subcategory}-{index+1:03d}',
        'name': name_de,
        'name_fr': name_fr,
        'name_en': name_en,
        'slug': slug,
        'price': price,
        'oldPrice': old_price,
        'description': desc_de,
        'description_fr': desc_fr,
        'description_en': desc_en,
        'category': category,
        'subcategory': subcategory,
        'images': [image_name],
        'sizes': subcat_config['sizes'],
        'colors': selected_colors
    }
    
    return product, image_name

def main():
    all_products = []
    all_image_names = []
    
    for category, subcategories in subcategories_config.items():
        for subcategory, config in subcategories.items():
            print(f"Génération de 50 produits pour {category}/{subcategory}...")
            for i in range(50):
                product, image_name = generate_product(category, subcategory, config, i)
                all_products.append(product)
                all_image_names.append(f"{image_name}.jpg")
    
    # Écrire les produits en format TypeScript
    with open('new_products.ts', 'w', encoding='utf-8') as f:
        f.write("// Nouveaux produits générés automatiquement\n")
        f.write("// Total: 800 produits (50 par sous-catégorie)\n\n")
        f.write("export const newProducts = [\n")
        for i, product in enumerate(all_products):
            f.write("  {\n")
            f.write(f"    id: '{product['id']}',\n")
            f.write(f"    name: '{product['name']}',\n")
            f.write(f"    name_fr: '{product['name_fr']}',\n")
            f.write(f"    name_en: '{product['name_en']}',\n")
            f.write(f"    slug: '{product['slug']}',\n")
            f.write(f"    price: {product['price']},\n")
            if product['oldPrice']:
                f.write(f"    oldPrice: {product['oldPrice']},\n")
            f.write(f"    description: '{product['description']}',\n")
            f.write(f"    description_fr: '{product['description_fr']}',\n")
            f.write(f"    description_en: '{product['description_en']}',\n")
            f.write(f"    category: '{product['category']}',\n")
            f.write(f"    subcategory: '{product['subcategory']}',\n")
            f.write(f"    images: {json.dumps(product['images'])},\n")
            f.write(f"    sizes: {json.dumps(product['sizes'])},\n")
            f.write(f"    colors: {json.dumps(product['colors'], ensure_ascii=False)},\n")
            f.write("  }")
            if i < len(all_products) - 1:
                f.write(",")
            f.write("\n")
        f.write("];\n")
    
    # Écrire la liste des noms d'images
    with open('produits.txt', 'w', encoding='utf-8') as f:
        for image_name in all_image_names:
            f.write(f"{image_name}\n")
    
    print(f"\n✅ Génération terminée!")
    print(f"   - {len(all_products)} produits créés")
    print(f"   - {len(all_image_names)} noms d'images dans produits.txt")
    print(f"   - Fichier new_products.ts créé")

if __name__ == '__main__':
    main()


























