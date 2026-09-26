import asyncio
import os
import sys
from datetime import datetime
from bson import ObjectId

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import connect_to_mongo, close_mongo_connection, db_config
from app.core.config import settings

COUNTERS = [
    {
        '_id': 'user_id',
        'sequence_value': 4,
    },
    {
        '_id': 'product_id',
        'sequence_value': 6,
    },
    {
        '_id': 'order_id',
        'sequence_value': 17,
    },
]

USERS = [
    {
        '_id': 'user_02',
        'email': 'puvanakopis@gmail.com',
        'hashed_password': '$argon2id$v=19$m=65536,t=3,p=4$oXTu3VsLQUhJqTWm9F4rpQ$PlydNTXsCYQqF+h+dlewmkfTjnOaMTYzwgbJN7TqRQc',
        'first_name': 'Puvanakopis',
        'last_name': 'Menahanathan',
        'role': 'user',
        'created_at': datetime.fromisoformat('2026-06-06T06:15:01.403000'),
        'address': 'Sasthiriyar Road, Kaluthavalai 04, Batticaloa',
        'avatar_initials': 'PM',
        'phone': '0754614044',
        'updated_at': datetime.fromisoformat('2026-09-06T16:07:53.881000'),
        'city': 'Batticaloa',
        'country': 'Sri Lanka',
        'state': 'Western Province',
        'zip_code': '30197',
    },
    {
        '_id': 'user_03',
        'email': 'puvanakopis1@gmail.com',
        'hashed_password': '$argon2id$v=19$m=65536,t=3,p=4$+f8fo5SS0tq715qT0lorZQ$Jpr2KrgsOug5kmzTL3cfvoVO6ORlTVNAcXEEaDq3pYw',
        'first_name': 'Puvanakopis',
        'last_name': 'Menahanathan',
        'role': 'admin',
        'created_at': datetime.fromisoformat('2026-06-06T07:30:04.036000'),
        'address': 'Sasthiriyar Rood, Kaluthavalai 03, Batticaloa',
        'avatar_initials': 'PM',
        'phone': '0754614044',
        'updated_at': datetime.fromisoformat('2026-06-06T12:47:47.034000'),
        'push_notifications': False,
    },
    {
        '_id': 'user_04',
        'email': 'puvanakopis2@gmail.com',
        'hashed_password': '$argon2id$v=19$m=65536,t=3,p=4$6l1rrRUCwJjzXivlnJPSGg$6SGBtGdkCpAWAfUrT0r9IN3eItyaHzFKuokLCHpLE+s',
        'first_name': 'Puvanakopis',
        'last_name': 'Menahanathan',
        'role': 'user',
        'created_at': datetime.fromisoformat('2026-06-06T09:15:27.066000'),
    },
]

PRODUCTS = [
    {
        '_id': 'product_01',
        'title': 'iPhone 16',
        'subtitle': 'Forged in titanium. Built for precision. Designed for Pro performance.',
        'price': '329,900',
        'imageSrc': 'http://localhost:8000/uploads/c86404d7-3f0e-4b58-b618-fef5d792aceb.png',
        'imageAlt': 'iPhone 16',
        'colors': [
            {
                'name': 'Black Titanium',
                'hex': '#1C1C1E',
                'images': [
                    'http://localhost:8000/uploads/70acff83-a4e5-42ea-b265-5eb1bd6076b0.png',
                    'http://localhost:8000/uploads/ff5da6a9-3690-43c6-a97e-87b16f896792.png',
                    'http://localhost:8000/uploads/692b4b48-2258-47a1-bcdc-701bbc3be3f4.png',
                    'http://localhost:8000/uploads/17d2c0ba-7062-46a0-afbe-f109885c82bd.png',
                    'http://localhost:8000/uploads/1d2096ac-831b-4c1b-a63d-6111e14bc1cb.png',
                    'http://localhost:8000/uploads/279732d7-47b5-4fe7-9a86-e6789b01b554.png',
                ],
            },
            {
                'name': 'White Titanium',
                'hex': '#F2F2F2',
                'images': [
                    'http://localhost:8000/uploads/ee7ad938-20b8-47f4-9732-b15217d1008f.png',
                    'http://localhost:8000/uploads/78236c65-fef2-4e01-b9f4-725402dbb0b2.png',
                    'http://localhost:8000/uploads/d751a2bf-c2d4-4714-acdc-4cf64994233a.png',
                    'http://localhost:8000/uploads/e6bb4586-383b-4b8c-9357-6a7bb8839cb9.png',
                    'http://localhost:8000/uploads/6103d8bb-70bd-4969-9db8-a22f3c0ff919.png',
                    'http://localhost:8000/uploads/91492710-b736-498f-9fde-acbc4ae6b001.png',
                ],
            },
            {
                'name': 'Ultramarine',
                'hex': '#4b5dfb',
                'images': [
                    'http://localhost:8000/uploads/6e1ede1f-043a-4ae0-a6d9-d49fb334c3bf.png',
                    'http://localhost:8000/uploads/1aa240c2-97ba-4111-bc5b-bd1b08650045.png',
                    'http://localhost:8000/uploads/a279f4b9-68d3-4c5c-bc32-a69f698a7d7c.png',
                    'http://localhost:8000/uploads/aa707361-2597-49e9-932b-6d53e74f945f.png',
                    'http://localhost:8000/uploads/57f0403e-0ced-46b9-a031-623e540a6ed9.png',
                    'http://localhost:8000/uploads/fa303f0e-561f-4215-a346-3f7c0ead956b.png',
                ],
            },
            {
                'name': 'Pink Titanium',
                'hex': '#F7A1C4',
                'images': [
                    'http://localhost:8000/uploads/d0d864b9-98cc-4279-92fd-8918b1e03c21.png',
                    'http://localhost:8000/uploads/9ab8427d-b7c7-404a-9fe6-ec65087b4cc8.png',
                    'http://localhost:8000/uploads/0e3ac298-9319-4192-a38a-a12be9474050.png',
                    'http://localhost:8000/uploads/a63b26fc-ee3b-4107-8941-c19e9f3788da.png',
                    'http://localhost:8000/uploads/5d2ee54d-c575-4246-a667-89ea775b0472.png',
                    'http://localhost:8000/uploads/ef4a28ca-1039-4d8e-97bb-648455003cf1.png',
                ],
            },
        ],
        'storage': [
            {
                'size': '256GB',
                'price': '329,900',
            },
            {
                'size': '512GB',
                'price': '379,900',
            },
            {
                'size': '1TB',
                'price': '449,900',
            },
        ],
        'features': [
            {
                'title': 'A18 Pro Chip',
                'description': 'High-performance silicon optimized for gaming, AI, and pro workflows.',
                'icon': 'Smartphone',
            },
            {
                'title': 'Titanium Design',
                'description': 'Lightweight yet highly durable aerospace-grade frame.',
                'icon': 'Smartphone',
            },
            {
                'title': 'Pro Camera System',
                'description': 'Advanced multi-lens system for low-light and computational photography.',
                'icon': 'Smartphone',
            },
        ],
        'specifications': {
            'finish': 'Black Titanium, White Titanium, Natural Titanium, Desert Titanium',
            'capacity': '128GB, 256GB, 512GB, 1TB',
            'chip': 'Latest Apple A18 Pro chip',
            'camera': '48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto',
            'body': {
                'dimensions': '149.6 x 71.5 x 8.25 mm',
                'weight': '199 grams',
                'build': 'Grade 5 Titanium frame, Ceramic Shield front, textured matte glass back',
            },
            'display': {
                'type': 'Super Retina XDR OLED, ProMotion 120Hz, Always-On',
                'size': '6.3-inch',
                'resolution': '2622 x 1206 pixels at 460 ppi',
            },
            'main_camera': {
                'type': 'Pro Triple Camera System (Fusion + Ultra Wide + 5x Telephoto)',
                'megapixels': '48MP Fusion (f/1.78) + 48MP Ultra Wide (f/2.2) + 12MP 5x Telephoto (f/2.8)',
                'video': '4K Dolby Vision HDR recording at 120 fps, 4K ProRes',
            },
            'selfie_camera': {
                'megapixels': '12MP TrueDepth (f/1.9) with Autofocus',
                'video': '4K Dolby Vision HDR at 60 fps',
            },
            'battery': {
                'type': 'Li-Ion 3,582 mAh, non-removable',
                'charging': 'USB-C fast charge (50% in 30 min), 25W MagSafe, 15W Qi2 wireless',
            },
            'platform': {
                'chip': 'Apple A18 Pro (6-core CPU, 6-core GPU, 16-core Neural Engine)',
                'os': 'iOS 18',
            },
        },
        'reviews': [],
        'created_at': datetime.fromisoformat('2026-06-06T16:39:15.326000'),
        'updated_at': datetime.fromisoformat('2026-06-06T16:39:15.326000'),
        'view_count': 130,
    },
    {
        '_id': 'product_02',
        'title': 'iPhone 14',
        'subtitle': 'Beyond Pro. Built for performance.',
        'price': '349,900',
        'imageSrc': 'http://localhost:8000/uploads/b6f19c77-fb70-4701-a7e1-7e87ea74fda0.png',
        'imageAlt': 'iPhone 14 ',
        'colors': [
            {
                'name': 'Deep Purple',
                'hex': '#5B2C6F',
                'images': [
                    'http://localhost:8000/uploads/f8849a74-5cb5-4cc3-b6fa-0f18a4628856.png',
                    'http://localhost:8000/uploads/2c56493d-f2e3-443f-b6df-710dcf168140.png',
                ],
            },
            {
                'name': 'Gold',
                'hex': '#D4AF37',
                'images': [
                    'http://localhost:8000/uploads/434d5802-a657-4cde-b0d0-b162e91c5aeb.png',
                    'http://localhost:8000/uploads/7f4a0a1b-b41c-473b-bbb1-55b72bec4a2e.png',
                    'http://localhost:8000/uploads/8555e78b-f5e1-478a-b66c-9767aa63341a.png',
                    'http://localhost:8000/uploads/46c6ac98-7079-4ae3-bbe3-b4cde07a0617.png',
                    'http://localhost:8000/uploads/e7aeb3c0-d3cf-4888-b972-faec529bc16e.png',
                    'http://localhost:8000/uploads/fcdf4298-fd73-49ab-aa6b-2bb1c1ed66c6.png',
                ],
            },
            {
                'name': 'Silver',
                'hex': '#C0C0C0',
                'images': [
                    'http://localhost:8000/uploads/ace87c99-eff0-4ab8-b321-7d340fcee6bb.png',
                    'http://localhost:8000/uploads/94712026-6f0c-4b5c-a607-109ed7edcafc.png',
                    'http://localhost:8000/uploads/60b6982e-1194-424f-98d8-044fbe2127fd.png',
                    'http://localhost:8000/uploads/c2a0c99c-9f19-477d-9d6b-29520e85643b.png',
                    'http://localhost:8000/uploads/ffc8b915-8830-4ba2-b39b-c184f78edd91.png',
                    'http://localhost:8000/uploads/3992fb64-6621-45ec-b051-e88bd2d9f22a.png',
                ],
            },
            {
                'name': 'Space Black',
                'hex': '#0B0B0F',
                'images': [
                    'http://localhost:8000/uploads/514f07e8-2484-4268-837a-7da3b7151b2a.png',
                    'http://localhost:8000/uploads/f02a9d6a-a68b-4908-a66f-21f2e987fd2f.png',
                    'http://localhost:8000/uploads/0dc34032-2a31-4277-8ebd-a47bdb29bae8.png',
                    'http://localhost:8000/uploads/31ee1827-1bfc-4d31-a762-ca8a1136eab6.png',
                    'http://localhost:8000/uploads/220dac8e-3ecc-4c15-bf15-ce71c4a370b8.png',
                    'http://localhost:8000/uploads/ec452994-4b65-4df4-abb2-65fe054b104d.png',
                ],
            },
        ],
        'storage': [
            {
                'size': '128GB',
                'price': 'Rs. 349,900',
            },
            {
                'size': '256GB',
                'price': 'Rs. 379,900',
            },
            {
                'size': '512GB',
                'price': 'Rs. 449,900',
            },
            {
                'size': '1TB',
                'price': 'Rs. 519,900',
            },
        ],
        'features': [
            {
                'title': 'A16 Bionic Chip',
                'description': 'Smartphone-grade performance with high efficiency and sustained power.',
                'icon': 'Smartphone',
            },
            {
                'title': 'Pro Camera System',
                'description': '48MP main camera with advanced computational photography.',
                'icon': 'Smartphone',
            },
            {
                'title': 'Dynamic Island',
                'description': 'Adaptive UI experience replacing the notch with interactive alerts.',
                'icon': 'Smartphone',
            },
        ],
        'specifications': {
            'finish': 'Deep Purple, Gold, Silver, Space Black (Stainless Steel Frame, Textured Matte Glass Back)',
            'capacity': '128GB, 256GB, 512GB, 1TB',
            'chip': 'A16 Bionic chip',
            'camera': '48MP Main + 12MP Ultra Wide + 12MP 3x Telephoto',
            'body': {
                'dimensions': '160.7 x 77.6 x 7.85 mm',
                'weight': '240 grams',
                'build': 'Stainless steel frame, Ceramic Shield front, textured matte glass back',
            },
            'display': {
                'type': 'Super Retina XDR OLED, ProMotion 120Hz, Always-On',
                'size': '6.7-inch',
                'resolution': '2796 x 1290 pixels at 460 ppi',
            },
            'main_camera': {
                'type': 'Pro Triple Camera System',
                'megapixels': '48MP Main (f/1.78) + 12MP Ultra Wide (f/2.2) + 12MP 3x Telephoto (f/2.8)',
                'video': '4K Cinematic mode at 30 fps, 4K ProRes at 30 fps',
            },
            'selfie_camera': {
                'megapixels': '12MP TrueDepth (f/1.9) with Autofocus',
                'video': '4K Dolby Vision HDR up to 60 fps',
            },
            'battery': {
                'type': 'Li-Ion 4,323 mAh, non-removable',
                'charging': 'Fast charging (50% in 30 min), 15W MagSafe, 7.5W Qi wireless',
            },
            'platform': {
                'chip': 'Apple A16 Bionic (6-core CPU, 5-core GPU, 16-core Neural Engine)',
                'os': 'iOS 16 (upgradable to iOS 18)',
            },
        },
        'reviews': [],
        'created_at': datetime.fromisoformat('2026-06-06T18:16:50.660000'),
        'updated_at': datetime.fromisoformat('2026-06-06T18:27:37.834000'),
        'view_count': 71,
    },
    {
        '_id': 'product_03',
        'title': 'iPhone 15',
        'subtitle': 'A16 Bionic. Dynamic Island. Smarter everyday performance.',
        'price': 'Rs. 249,900',
        'imageSrc': 'http://localhost:8000/uploads/582ac4a4-8ff9-4733-9343-b237d682d0dd.png',
        'imageAlt': 'iPhone 15',
        'colors': [
            {
                'name': 'Black',
                'hex': '#1C1C1E',
                'images': [
                    'http://localhost:8000/uploads/8468a222-1194-4cd6-a76a-f6e4426dbb4a.png',
                    'http://localhost:8000/uploads/dde5b4a5-a22c-45ef-bfad-6b496e5c23d2.png',
                    'http://localhost:8000/uploads/a13b466e-0dcd-4fcf-99bf-81e94f59d90b.png',
                    'http://localhost:8000/uploads/3f73ee19-100c-4e54-a0af-75dd03c3e628.png',
                    'http://localhost:8000/uploads/14314963-a60b-4de5-aa8c-225dd0c483ab.png',
                    'http://localhost:8000/uploads/a1f6d2ae-a6b7-479c-8c06-769ab7e097be.png',
                ],
            },
            {
                'name': 'Blue',
                'hex': '#4F6BFF',
                'images': [
                    'http://localhost:8000/uploads/16273205-1f62-41e1-af5b-2adc9a4f07a1.png',
                    'http://localhost:8000/uploads/f8ea6c11-41da-4a80-8c71-18667a56b5ef.png',
                    'http://localhost:8000/uploads/e2fda404-18ef-401d-b97b-54a586b6af1c.png',
                    'http://localhost:8000/uploads/49eeb2cd-383a-4d41-bfdf-53fb6524e42c.png',
                    'http://localhost:8000/uploads/7c686204-df35-43cd-b100-c1d7c83ba2af.png',
                    'http://localhost:8000/uploads/b50b7e90-88b0-4235-a4fe-132d46deb47f.png',
                ],
            },
            {
                'name': 'Green',
                'hex': '#A8E6CF',
                'images': [
                    'http://localhost:8000/uploads/e2af9fd4-bcf7-4945-9fcc-b03125abf81f.png',
                    'http://localhost:8000/uploads/a2b34643-b961-4d48-b852-ea3c47752aed.png',
                    'http://localhost:8000/uploads/5a9bb816-43d0-406d-92ff-64c00ccf2689.png',
                    'http://localhost:8000/uploads/aa6598fa-0ae0-4b02-bd7a-1d0a65d0ab60.png',
                    'http://localhost:8000/uploads/8bc37571-b662-4d03-97f7-8a73befc79c5.png',
                    'http://localhost:8000/uploads/bd399ce1-ab5d-42af-bcf9-85bdef7dd81f.png',
                ],
            },
            {
                'name': 'Yellow',
                'hex': '#FFE066',
                'images': [
                    'http://localhost:8000/uploads/3a42f130-dadc-41d5-8ee0-fb5cc73bd067.png',
                    'http://localhost:8000/uploads/0cbe3d43-5678-447c-8a50-7092f9654ee1.png',
                    'http://localhost:8000/uploads/09fe54d2-8bce-4969-a548-6e2091c3c41e.png',
                    'http://localhost:8000/uploads/6699966d-5633-482d-aa16-c9724ea5e40b.png',
                    'http://localhost:8000/uploads/efaf9374-4bf7-45c3-a47a-ba6b350d0413.png',
                    'http://localhost:8000/uploads/524dc4ad-b844-4deb-b70c-61be2878f773.png',
                ],
            },
        ],
        'storage': [
            {
                'size': '128GB',
                'price': 'Rs. 249,900',
            },
            {
                'size': '256GB',
                'price': 'Rs. 279,900',
            },
            {
                'size': '512GB',
                'price': 'Rs. 329,900',
            },
        ],
        'features': [
            {
                'title': 'A16 Bionic Chip',
                'description': 'High-efficiency performance for gaming, photography, and multitasking',
                'icon': 'cpu',
            },
            {
                'title': 'Dynamic Island',
                'description': 'Interactive alerts and live updates built into the display',
                'icon': 'activity',
            },
            {
                'title': 'Advanced Dual Camera System',
                'description': '48MP main camera with improved low-light performance and Smart HDR',
                'icon': 'camera',
            },
        ],
        'specifications': {
            'finish': 'Black, Blue, Green, Yellow, Pink (Aluminum with color-infused glass back)',
            'capacity': '128GB, 256GB, 512GB',
            'chip': 'A16 Bionic chip',
            'camera': '48MP Main + 12MP Ultra Wide',
            'body': {
                'dimensions': '147.6 x 71.6 x 7.80 mm',
                'weight': '171 grams',
                'build': 'Aluminum design, Ceramic Shield front, color-infused glass back',
            },
            'display': {
                'type': 'Super Retina XDR OLED display, Dynamic Island',
                'size': '6.1-inch',
                'resolution': '2556 x 1179 pixels at 460 ppi',
            },
            'main_camera': {
                'type': 'Advanced Dual-Camera System',
                'megapixels': '48MP Main (f/1.6) + 12MP Ultra Wide (f/2.4)',
                'video': '4K Dolby Vision HDR recording up to 60 fps, Cinematic mode',
            },
            'selfie_camera': {
                'megapixels': '12MP TrueDepth (f/1.9) with Autofocus',
                'video': '4K video recording up to 60 fps',
            },
            'battery': {
                'type': 'Li-Ion 3,349 mAh, non-removable',
                'charging': 'USB-C fast charge (50% in 30 min), 15W MagSafe, 15W Qi2',
            },
            'platform': {
                'chip': 'Apple A16 Bionic (6-core CPU, 5-core GPU, 16-core Neural Engine)',
                'os': 'iOS 17 (upgradable to iOS 18)',
            },
        },
        'reviews': [],
        'created_at': datetime.fromisoformat('2026-06-06T18:33:56.284000'),
        'updated_at': datetime.fromisoformat('2026-06-06T18:33:56.284000'),
        'view_count': 48,
    },
    {
        '_id': 'product_04',
        'title': 'iPhone 13',
        'subtitle': 'Your new superpower.',
        'price': 'Rs 329,900',
        'imageSrc': 'http://localhost:8000/uploads/5e4b048f-0b5b-4734-8a83-b1ddeb80a68b.png',
        'imageAlt': 'iPhone 13',
        'category': None,
        'tags': None,
        'colors': [
            {
                'name': 'Graphite',
                'hex': '#4B4B4D',
                'images': [
                    'http://localhost:8000/uploads/708a573d-39de-487c-84a9-820d5d8ba056.png',
                    'http://localhost:8000/uploads/1df94747-c1db-4ae7-96a7-0507f7b406ae.png',
                    'http://localhost:8000/uploads/92317ee7-38e9-4b2e-ae0a-74df6bdf28f1.png',
                    'http://localhost:8000/uploads/c755bc47-9263-4e7e-8a09-6bf42f26f78e.png',
                    'http://localhost:8000/uploads/f7fc8151-fc3a-4207-8fe9-6612e04d21c1.png',
                    'http://localhost:8000/uploads/f4ff7b5e-56db-4c7c-991a-939ad70be944.png',
                ],
            },
            {
                'name': 'Silver',
                'hex': '#F5F5F7',
                'images': [
                    'http://localhost:8000/uploads/a3188035-4e84-4c69-819b-405f94959e66.png',
                    'http://localhost:8000/uploads/05317878-efbc-45a6-845c-9ebeb37410e0.png',
                    'http://localhost:8000/uploads/bb8166c1-86a3-44d1-94e0-0930b7a674b3.png',
                    'http://localhost:8000/uploads/5c5d9ee3-885c-4feb-9398-337d7ef39810.png',
                    'http://localhost:8000/uploads/5cce3b9e-5bd4-430d-87ae-7ba5ef2a3c60.png',
                    'http://localhost:8000/uploads/ed83a234-ab59-4072-a9a6-e73e30e8aaa5.png',
                ],
            },
            {
                'name': 'Gold',
                'hex': '#F4E8CE',
                'images': [
                    'http://localhost:8000/uploads/d4156fe7-a8b1-4594-a442-59cc94a6988f.png',
                    'http://localhost:8000/uploads/0a58afb2-8931-4121-87ad-868e1746e433.png',
                    'http://localhost:8000/uploads/38680e65-7349-4b21-9b8f-570676e9280f.png',
                    'http://localhost:8000/uploads/9a06db93-db76-4abc-a513-ff8931399429.png',
                    'http://localhost:8000/uploads/343abefa-594b-4db2-8677-32503a7cc9f4.png',
                    'http://localhost:8000/uploads/82a78324-c8f4-42b3-9158-9356ae9c9f9c.png',
                ],
            },
            {
                'name': 'Sierra Blue',
                'hex': '#A7C7E7',
                'images': [
                    'http://localhost:8000/uploads/9328606f-596c-44d1-b35f-0e587eb3087a.png',
                    'http://localhost:8000/uploads/21250c67-f765-4ebb-8c0b-9784e9438df2.png',
                    'http://localhost:8000/uploads/9fca32b5-7711-48c4-abac-c76367736840.png',
                    'http://localhost:8000/uploads/d0c58503-945a-4810-b7cb-785b9a5aeb46.png',
                    'http://localhost:8000/uploads/a31fe507-8750-4453-990e-621d71940af7.png',
                    'http://localhost:8000/uploads/f6440bac-f879-45d7-b5ee-a4e3f44bdc2d.png',
                ],
            },
        ],
        'storage': [
            {
                'size': '128GB',
                'price': 'Rs. 329,900',
            },
            {
                'size': '256GB',
                'price': 'Rs. 369,900',
            },
            {
                'size': '512GB',
                'price': 'Rs. 449,900',
            },
            {
                'size': '1TB',
                'price': 'Rs. 529,900',
            },
        ],
        'features': [
            {
                'title': 'A15 Bionic Chip',
                'description': 'Powerful A15 Bionic processor delivers exceptional performance, efficiency, and graphics capabilities.',
                'icon': 'cpu',
            },
            {
                'title': 'Pro Camera System',
                'description': 'Triple-camera setup with Ultra Wide, Wide, and Telephoto lenses for professional photography and video.',
                'icon': 'camera',
            },
            {
                'title': 'ProMotion Display',
                'description': 'Adaptive refresh rate up to 120Hz for smoother scrolling, gaming, and responsiveness.',
                'icon': 'monitor',
            },
        ],
        'specifications': {
            'finish': 'Graphite, Silver, Gold, Sierra Blue',
            'capacity': '128GB, 256GB, 512GB, 1TB',
            'chip': 'A15 Bionic chip with 5-core GPU',
            'camera': '12MP Main + 12MP Ultra Wide + 12MP 3x Telephoto',
            'body': {
                'dimensions': '146.7 x 71.5 x 7.65 mm',
                'weight': '204 grams',
                'build': 'Stainless steel frame, Ceramic Shield front, textured matte glass back',
            },
            'display': {
                'type': 'Super Retina XDR OLED display with ProMotion (10-120Hz)',
                'size': '6.1-inch',
                'resolution': '2532 x 1170 pixels at 460 ppi',
            },
            'main_camera': {
                'type': 'Pro Triple-Camera System',
                'megapixels': '12MP Main (f/1.5) + 12MP Ultra Wide (f/1.8) + 12MP 3x Telephoto (f/2.8)',
                'video': 'Cinematic mode (1080p at 30 fps), ProRes video recording up to 4K',
            },
            'selfie_camera': {
                'megapixels': '12MP TrueDepth (f/2.2)',
                'video': '4K Dolby Vision HDR recording up to 60 fps',
            },
            'battery': {
                'type': 'Li-Ion 3,095 mAh, non-removable',
                'charging': 'Fast charging (50% in 30 min), 15W MagSafe, 7.5W Qi wireless',
            },
            'platform': {
                'chip': 'Apple A15 Bionic (6-core CPU, 5-core GPU, 16-core Neural Engine)',
                'os': 'iOS 15 (upgradable to iOS 18)',
            },
        },
        'reviews': [],
        'created_at': datetime.fromisoformat('2026-06-08T18:06:07.074000'),
        'updated_at': datetime.fromisoformat('2026-06-08T18:06:07.074000'),
        'like_count': 0,
        'view_count': 3,
    },
    {
        '_id': 'product_05',
        'title': 'iPhone 12',
        'subtitle': "It's a leap year.",
        'price': 'Rs. 269,900',
        'imageSrc': 'http://localhost:8000/uploads/f3c77a70-b5de-46da-be51-40a3422132a9.png',
        'imageAlt': 'iPhone 12',
        'category': None,
        'tags': None,
        'colors': [
            {
                'name': 'Graphite',
                'hex': '#4A4A4A',
                'images': [
                    'http://localhost:8000/uploads/c43a731f-c98a-4fd1-8fcd-8cf6f19d184c.png',
                    'http://localhost:8000/uploads/0c9b5d9f-3603-48f9-b056-19343e9309d2.png',
                    'http://localhost:8000/uploads/fd894f4d-548b-47e1-b683-3a39b6a4c519.png',
                    'http://localhost:8000/uploads/1f8c9a13-1bd5-4827-8e90-8e3341503854.png',
                    'http://localhost:8000/uploads/d4702ae8-dc94-426b-9763-3ada980a1e84.png',
                    'http://localhost:8000/uploads/b6c3103b-58fc-4677-b393-e9d72162d44f.png',
                ],
            },
            {
                'name': 'Silver',
                'hex': '#F2F2F2',
                'images': [
                    'http://localhost:8000/uploads/c1f4a31f-ea2f-4445-badd-4d049c97db05.png',
                    'http://localhost:8000/uploads/fc03df51-d720-4cf5-9663-b4999302902c.png',
                    'http://localhost:8000/uploads/b23366f0-34fb-4652-86ce-5af9303328a4.png',
                    'http://localhost:8000/uploads/897dc62b-30c3-4933-b884-442610e23617.png',
                    'http://localhost:8000/uploads/78e0b0f1-2377-40d6-b126-b72c8faea66c.png',
                    'http://localhost:8000/uploads/1c6ce573-6dc3-47f9-b751-aacb8d979281.png',
                ],
            },
        ],
        'storage': [
            {
                'size': '128GB',
                'price': 'Rs. 269,900',
            },
            {
                'size': '256GB',
                'price': 'Rs. 309,900',
            },
            {
                'size': '512GB',
                'price': 'Rs. 389,900',
            },
        ],
        'features': [
            {
                'title': 'A14 Bionic Chip',
                'description': 'The first smartphone chip built on a 5-nanometer process, delivering fast performance and efficiency.',
                'icon': 'cpu',
            },
            {
                'title': 'Pro Camera System',
                'description': 'Triple 12MP camera system with Ultra Wide, Wide, and Telephoto lenses for stunning photos and videos.',
                'icon': 'camera ',
            },
            {
                'title': 'LiDAR Scanner',
                'description': 'LiDAR technology improves low-light focusing and enables advanced AR experiences.',
                'icon': 'scan',
            },
        ],
        'specifications': {
            'finish': 'Graphite, Silver, Gold, Pacific Blue (Stainless Steel Frame, Matte Glass Back)',
            'capacity': '128GB, 256GB, 512GB',
            'chip': 'A14 Bionic chip',
            'camera': '12MP Main + 12MP Ultra Wide + 12MP 2x Telephoto',
            'body': {
                'dimensions': '146.7 x 71.5 x 7.4 mm',
                'weight': '189 grams',
                'build': 'Stainless steel frame, Ceramic Shield front, textured matte glass back',
            },
            'display': {
                'type': 'Super Retina XDR OLED display, HDR10',
                'size': '6.1-inch',
                'resolution': '2532 x 1170 pixels at 460 ppi',
            },
            'main_camera': {
                'type': 'Pro Triple-Camera System with LiDAR',
                'megapixels': '12MP Main (f/1.6) + 12MP Ultra Wide (f/2.4) + 12MP 2x Telephoto (f/2.0)',
                'video': '4K Dolby Vision HDR recording up to 60 fps',
            },
            'selfie_camera': {
                'megapixels': '12MP TrueDepth (f/2.2)',
                'video': '4K video recording up to 60 fps',
            },
            'battery': {
                'type': 'Li-Ion 2,815 mAh, non-removable',
                'charging': 'Fast charging 20W (50% in 30 min), 15W MagSafe, 7.5W Qi wireless',
            },
            'platform': {
                'chip': 'Apple A14 Bionic (6-core CPU, 4-core GPU, 16-core Neural Engine)',
                'os': 'iOS 14 (upgradable to iOS 18)',
            },
        },
        'reviews': [],
        'created_at': datetime.fromisoformat('2026-06-08T18:10:37.216000'),
        'updated_at': datetime.fromisoformat('2026-06-08T18:10:37.216000'),
        'like_count': 0,
        'view_count': 9,
    },
    {
        '_id': 'product_06',
        'title': 'iPhone 11',
        'subtitle': 'Just the right amount of everything.',
        'price': 'Rs. 149,900',
        'imageSrc': 'http://localhost:8000/uploads/a410df2c-4f6e-4603-bd4a-2983173fb074.png',
        'imageAlt': 'iPhone 11',
        'category': None,
        'tags': None,
        'colors': [
            {
                'name': 'Black',
                'hex': '#1C1C1E',
                'images': [
                    'http://localhost:8000/uploads/fff6bfa8-fffe-43c3-b996-dd028f36a186.png',
                    'http://localhost:8000/uploads/8deb064c-1c98-4a28-a022-8c82a40f559c.png',
                    'http://localhost:8000/uploads/7074bd9d-3ef3-4883-ace9-84ccc4cc45fb.png',
                    'http://localhost:8000/uploads/42dfc95c-5c3a-4a0b-8aff-1e1f6934e21d.png',
                    'http://localhost:8000/uploads/cd0c9bf1-b08c-442b-b007-c309eba0e74e.png',
                    'http://localhost:8000/uploads/70a8a98f-08bc-476c-9b43-0f9a3591cb09.png',
                ],
            },
            {
                'name': 'Red',
                'hex': '#D70015',
                'images': [
                    'http://localhost:8000/uploads/17d002fd-8860-47b0-bf73-3edbb9ceb476.png',
                    'http://localhost:8000/uploads/81505f1d-c1bf-4b1a-a7ef-c531229bbacc.png',
                    'http://localhost:8000/uploads/5d7b3df3-e36d-43be-b84b-33bbebe4320c.png',
                    'http://localhost:8000/uploads/2967be66-e56a-4c75-b462-0434d9e992f8.png',
                    'http://localhost:8000/uploads/eb31a4d9-793a-4e50-a711-285e9cb60d68.png',
                    'http://localhost:8000/uploads/ad2d4043-9cbd-4513-9f3f-d7a253808884.png',
                ],
            },
        ],
        'storage': [
            {
                'size': '64GB',
                'price': 'Rs. 149,900',
            },
            {
                'size': '128GB',
                'price': 'Rs. 169,900',
            },
            {
                'size': '256GB',
                'price': 'Rs. 199,900',
            },
        ],
        'features': [
            {
                'title': 'A13 Bionic Chip',
                'description': 'Fast and efficient A13 Bionic processor delivers smooth performance for apps, gaming, photography, and everyday tasks.',
                'icon': 'cpu',
            },
            {
                'title': 'Liquid Retina HD Display',
                'description': '6.1-inch LCD display with True Tone technology, wide color support, and excellent brightness for everyday use.',
                'icon': 'Smartphone',
            },
            {
                'title': 'Dual-Camera System',
                'description': '12MP Wide and Ultra Wide cameras with Night mode, Portrait mode, and 4K video recording capabilities.',
                'icon': 'Camera',
            },
        ],
        'specifications': {
            'finish': 'Black, Green, Yellow, Purple, White, Red (Glass and Aluminum)',
            'capacity': '64GB, 128GB, 256GB',
            'chip': 'A13 Bionic chip',
            'camera': '12MP Main + 12MP Ultra Wide',
            'body': {
                'dimensions': '150.9 x 75.7 x 8.3 mm',
                'weight': '194 grams',
                'build': 'Glass front and back, aluminum frame',
            },
            'display': {
                'type': 'Liquid Retina HD IPS LCD display, True Tone',
                'size': '6.1-inch',
                'resolution': '1792 x 828 pixels at 326 ppi',
            },
            'main_camera': {
                'type': 'Dual-Camera System',
                'megapixels': '12MP Main (f/1.8) + 12MP Ultra Wide (f/2.4)',
                'video': '4K video recording at 24 fps, 30 fps, or 60 fps',
            },
            'selfie_camera': {
                'megapixels': '12MP TrueDepth (f/2.2)',
                'video': '4K video recording up to 60 fps',
            },
            'battery': {
                'type': 'Li-Ion 3,110 mAh, non-removable',
                'charging': 'Fast charging 18W (50% in 30 min), Qi wireless charging',
            },
            'platform': {
                'chip': 'Apple A13 Bionic (6-core CPU, 4-core GPU, 8-core Neural Engine)',
                'os': 'iOS 13 (upgradable to iOS 18)',
            },
        },
        'reviews': [],
        'created_at': datetime.fromisoformat('2026-06-08T18:14:29.173000'),
        'updated_at': datetime.fromisoformat('2026-06-08T18:14:29.173000'),
        'like_count': 0,
        'view_count': 3,
    },
]

WISHLISTS = [
    {
        '_id': ObjectId('6a270017c09a216c7b4d9e78'),
        'user_id': 'user_03',
        'items': [],
        'created_at': datetime.fromisoformat('2026-06-08T17:47:03.734000+00:00'),
        'updated_at': datetime.fromisoformat('2026-06-08T17:47:03.734000+00:00'),
    },
    {
        '_id': ObjectId('6a2706cfc09a216c7b4d9e79'),
        'user_id': 'user_02',
        'items': [
            {
                'product_id': 'product_01',
                'title': 'iPhone 16',
                'price': '329,900',
                'imageSrc': 'http://localhost:8000/uploads/c86404d7-3f0e-4b58-b618-fef5d792aceb.png',
                'imageAlt': 'iPhone 16',
            },
            {
                'product_id': 'product_02',
                'title': 'iPhone 14',
                'price': '349,900',
                'imageSrc': 'http://localhost:8000/uploads/b6f19c77-fb70-4701-a7e1-7e87ea74fda0.png',
                'imageAlt': 'iPhone 14 ',
            },
            {
                'product_id': 'product_03',
                'title': 'iPhone 15',
                'price': 'Rs. 249,900',
                'imageSrc': 'http://localhost:8000/uploads/582ac4a4-8ff9-4733-9343-b237d682d0dd.png',
                'imageAlt': 'iPhone 15',
            },
        ],
        'created_at': datetime.fromisoformat('2026-06-08T18:15:43.405000+00:00'),
        'updated_at': datetime.fromisoformat('2026-09-06T16:15:48.192000+00:00'),
    },
]

ORDERS = [
    {
        '_id': 'order_01',
        'user_id': 'user_02',
        'customer_details': {
            'firstName': 'Puvanakopis',
            'lastName': 'Menahanathan',
            'email': 'puvanakopis@gmail.com',
            'phone': '0754614044',
        },
        'shipping_address': {
            'address': 'Sasthiriyar Rood, Kaluthavalai 03, Batticaloa',
            'city': 'Batticaloa',
            'state': '',
            'zipCode': '30197',
            'country': 'Sri Lanka',
        },
        'payment_details': {
            'cardholder': 'puvan',
            'cardNumber': '**** **** **** 1651',
            'expiry': '05/28',
        },
        'items': [
            {
                'product_id': 'product_02',
                'title': 'iPhone 14',
                'price': 'Rs. 519,900',
                'imageSrc': 'http://localhost:8000/uploads/434d5802-a657-4cde-b0d0-b162e91c5aeb.png',
                'color': 'Gold',
                'storage': '1TB',
                'quantity': 3,
            },
        ],
        'subtotal': 1559700.0,
        'discount': 0.0,
        'shipping': 0.0,
        'tax': 280746.0,
        'total': 1840446.0,
        'promo_code': None,
        'status': 'Confirmed',
        'payment': 'Paid',
        'created_at': datetime.fromisoformat('2026-06-09T05:05:08.462000'),
        'updated_at': datetime.fromisoformat('2026-06-09T05:05:08.462000'),
    },
    {
        '_id': 'order_02',
        'user_id': 'user_02',
        'customer_details': {
            'firstName': 'Puvanakopis',
            'lastName': 'Menahanathan',
            'email': 'puvanakopis@gmail.com',
            'phone': '0754614044',
        },
        'shipping_address': {
            'address': 'Sasthiriyar Rood, Kaluthavalai 03, Batticaloa',
            'city': 'Colombo',
            'state': 'Western Province',
            'zipCode': '00300',
            'country': 'Sri Lanka',
        },
        'payment_details': {
            'cardholder': 'Puvanakopis Menahanathan',
            'cardNumber': '**** **** **** 4242',
            'expiry': '12/28',
        },
        'items': [
            {
                'product_id': 'product_02',
                'title': 'iPhone 14',
                'price': 'Rs. 349,900',
                'imageSrc': 'http://localhost:8000/uploads/f8849a74-5cb5-4cc3-b6fa-0f18a4628856.png',
                'color': 'Deep Purple',
                'storage': '128GB',
                'quantity': 2,
            },
        ],
        'subtotal': 699800.0,
        'discount': 0.0,
        'shipping': 0.0,
        'tax': 57733.5,
        'total': 757533.5,
        'promo_code': None,
        'status': 'Confirmed',
        'payment': 'Paid',
        'created_at': datetime.fromisoformat('2026-06-09T05:06:07.374000'),
        'updated_at': datetime.fromisoformat('2026-06-09T05:06:07.374000'),
    },
    {
        '_id': 'order_03',
        'user_id': 'user_02',
        'customer_details': {
            'firstName': 'Puvanakopis',
            'lastName': 'Menahanathan',
            'email': 'puvanakopis@gmail.com',
            'phone': '0754614044',
        },
        'shipping_address': {
            'address': 'Sasthiriyar Rood, Kaluthavalai 03, Batticaloa',
            'city': 'Colombo',
            'state': 'Western Province',
            'zipCode': '00300',
            'country': 'Sri Lanka',
        },
        'payment_details': {
            'cardholder': 'Puvanakopis Menahanathan',
            'cardNumber': '**** **** **** 4242',
            'expiry': '12/28',
        },
        'items': [
            {
                'product_id': 'product_02',
                'title': 'iPhone 14',
                'price': 'Rs. 449,900',
                'imageSrc': 'http://localhost:8000/uploads/434d5802-a657-4cde-b0d0-b162e91c5aeb.png',
                'color': 'Gold',
                'storage': '512GB',
                'quantity': 2,
            },
        ],
        'subtotal': 899800.0,
        'discount': 0.0,
        'shipping': 0.0,
        'tax': 74233.5,
        'total': 974033.5,
        'promo_code': None,
        'status': 'Confirmed',
        'payment': 'Paid',
        'created_at': datetime.fromisoformat('2026-06-10T12:37:37.231000'),
        'updated_at': datetime.fromisoformat('2026-06-10T12:37:37.231000'),
    },
    {
        '_id': 'order_04',
        'user_id': 'user_02',
        'customer_details': {
            'firstName': 'Puvanakopis',
            'lastName': 'Menahanathan',
            'email': 'puvanakopis@gmail.com',
            'phone': '0754614044',
        },
        'shipping_address': {
            'address': 'Sasthiriyar Rood, Kaluthavalai 03, Batticaloa',
            'city': 'Batticaloa',
            'state': '',
            'zipCode': '30197',
            'country': 'Sri Lanka',
        },
        'payment_details': {
            'cardholder': 'puvan',
            'cardNumber': '**** **** **** 1234',
            'expiry': '11/29',
        },
        'items': [
            {
                'product_id': 'product_01',
                'title': 'iPhone 16',
                'price': '379,900',
                'imageSrc': 'http://localhost:8000/uploads/6e1ede1f-043a-4ae0-a6d9-d49fb334c3bf.png',
                'color': 'Ultramarine',
                'storage': '512GB',
                'quantity': 1,
            },
        ],
        'subtotal': 379900.0,
        'discount': 0.0,
        'shipping': 0.0,
        'tax': 68382.0,
        'total': 448282.0,
        'promo_code': None,
        'status': 'Cancelled',
        'payment': 'Paid',
        'created_at': datetime.fromisoformat('2026-06-16T12:53:00.182000'),
        'updated_at': datetime.fromisoformat('2026-09-06T15:44:01.165000'),
    },
    {
        '_id': 'order_05',
        'user_id': 'user_02',
        'customer_details': {
            'firstName': 'Puvanakopis',
            'lastName': 'Menahanathan',
            'email': 'puvanakopis@gmail.com',
            'phone': '0754614044',
        },
        'shipping_address': {
            'address': 'Sasthiriyar Rood, Kaluthavalai 03, Batticaloa',
            'city': 'Colombo',
            'state': 'Western Province',
            'zipCode': '00300',
            'country': 'Sri Lanka',
        },
        'payment_details': {
            'cardholder': 'Puvanakopis Menahanathan',
            'cardNumber': '**** **** **** 4242',
            'expiry': '12/28',
        },
        'items': [
            {
                'product_id': 'product_05',
                'title': 'iPhone 12',
                'price': 'Rs. 309,900',
                'imageSrc': 'http://localhost:8000/uploads/c1f4a31f-ea2f-4445-badd-4d049c97db05.png',
                'color': 'Silver',
                'storage': '256GB',
                'quantity': 1,
            },
        ],
        'subtotal': 309900.0,
        'discount': 0.0,
        'shipping': 0.0,
        'tax': 25566.75,
        'total': 335466.75,
        'promo_code': None,
        'status': 'Delivered',
        'payment': 'Paid',
        'created_at': datetime.fromisoformat('2026-06-16T12:55:38.758000'),
        'updated_at': datetime.fromisoformat('2026-09-06T15:32:23.917000'),
    },
    {
        '_id': 'order_06',
        'user_id': 'user_02',
        'customer_details': {
            'firstName': 'Puvanakopis',
            'lastName': 'Menahanathan',
            'email': 'puvanakopis@gmail.com',
            'phone': '0754614044',
        },
        'shipping_address': {
            'address': 'Sasthiriyar Rood, Kaluthavalai 03, Batticaloa',
            'city': 'Colombo',
            'state': 'Western Province',
            'zipCode': '00300',
            'country': 'Sri Lanka',
        },
        'payment_details': {
            'cardholder': 'Puvanakopis Menahanathan',
            'cardNumber': '**** **** **** 4242',
            'expiry': '12/28',
        },
        'items': [
            {
                'product_id': 'product_01',
                'title': 'iPhone 16',
                'price': '329,900',
                'imageSrc': 'http://localhost:8000/uploads/70acff83-a4e5-42ea-b265-5eb1bd6076b0.png',
                'color': 'Black Titanium',
                'storage': '256GB',
                'quantity': 3,
            },
        ],
        'subtotal': 989700.0,
        'discount': 0.0,
        'shipping': 0.0,
        'tax': 81650.25,
        'total': 1071350.25,
        'promo_code': None,
        'status': 'Delivered',
        'payment': 'Paid',
        'created_at': datetime.fromisoformat('2026-08-06T03:17:02.894000'),
        'updated_at': datetime.fromisoformat('2026-09-06T15:31:54.466000'),
    },
    {
        '_id': 'order_11',
        'user_id': 'test_user_id',
        'customer_details': {
            'firstName': 'Test',
            'lastName': 'User',
            'email': 'testuser@example.com',
            'phone': '1234567890',
        },
        'shipping_address': {
            'address': '123 Street',
            'city': 'Colombo',
            'state': 'Western',
            'zipCode': '00100',
            'country': 'Sri Lanka',
        },
        'payment_details': {
            'cardholder': 'Test User',
            'cardNumber': '**** **** **** 4242',
            'expiry': '12/28',
        },
        'items': [
            {
                'product_id': 'product_01',
                'title': 'iPhone 16 Pro',
                'price': 'Rs. 450,000',
                'imageSrc': '/uploads/test.jpg',
                'color': 'Natural Titanium',
                'storage': '256GB',
                'quantity': 1,
            },
        ],
        'subtotal': 450000.0,
        'discount': 0.0,
        'shipping': 0.0,
        'tax': 0.0,
        'total': 450000.0,
        'promo_code': None,
        'status': 'Shipped',
        'payment': 'Paid',
        'created_at': datetime.fromisoformat('2026-09-06T15:25:54.314000'),
        'updated_at': datetime.fromisoformat('2026-09-06T15:25:54.457000'),
    },
    {
        '_id': 'order_12',
        'user_id': 'test_user_id',
        'customer_details': {
            'firstName': 'Test',
            'lastName': 'User',
            'email': 'testuser@example.com',
            'phone': '1234567890',
        },
        'shipping_address': {
            'address': '123 Street',
            'city': 'Colombo',
            'state': 'Western',
            'zipCode': '00100',
            'country': 'Sri Lanka',
        },
        'payment_details': {
            'cardholder': 'Test User',
            'cardNumber': '**** **** **** 4242',
            'expiry': '12/28',
        },
        'items': [
            {
                'product_id': 'product_01',
                'title': 'iPhone 16 Pro',
                'price': 'Rs. 450,000',
                'imageSrc': '/uploads/test.jpg',
                'color': 'Natural Titanium',
                'storage': '256GB',
                'quantity': 1,
            },
        ],
        'subtotal': 450000.0,
        'discount': 0.0,
        'shipping': 0.0,
        'tax': 0.0,
        'total': 450000.0,
        'promo_code': None,
        'status': 'Confirmed',
        'payment': 'Paid',
        'created_at': datetime.fromisoformat('2026-09-06T15:26:02.583000'),
        'updated_at': datetime.fromisoformat('2026-09-06T15:26:02.583000'),
    },
    {
        '_id': 'order_15',
        'user_id': 'user_02',
        'customer_details': {
            'firstName': 'Puvanakopis',
            'lastName': 'Menahanathan',
            'email': 'puvanakopis@gmail.com',
            'phone': '0754614044',
        },
        'shipping_address': {
            'address': 'Sasthiriyar Road, Kaluthavalai 04, Batticaloa',
            'city': 'Batticaloa',
            'state': '',
            'zipCode': '30197',
            'country': 'Sri Lanka',
        },
        'payment_details': {
            'cardholder': 'puvanakopis',
            'cardNumber': '**** **** **** 0000',
            'expiry': '06/28',
        },
        'items': [
            {
                'product_id': 'product_02',
                'title': 'iPhone 14',
                'price': 'Rs. 349,900',
                'imageSrc': 'http://localhost:8000/uploads/f8849a74-5cb5-4cc3-b6fa-0f18a4628856.png',
                'color': 'Deep Purple',
                'storage': '128GB',
                'quantity': 1,
            },
        ],
        'subtotal': 349900.0,
        'discount': 0.0,
        'shipping': 0.0,
        'tax': 62982.0,
        'total': 412882.0,
        'promo_code': None,
        'status': 'Confirmed',
        'payment': 'Paid',
        'created_at': datetime.fromisoformat('2026-09-06T15:58:53.586000'),
        'updated_at': datetime.fromisoformat('2026-09-06T15:58:53.586000'),
    },
    {
        '_id': 'order_16',
        'user_id': 'user_02',
        'customer_details': {
            'firstName': 'Puvanakopis',
            'lastName': 'Menahanathan',
            'email': 'puvanakopis@gmail.com',
            'phone': '0754614044',
        },
        'shipping_address': {
            'address': 'Sasthiriyar Road, Kaluthavalai 04, Batticaloa',
            'city': 'Colombo',
            'state': 'Western Province',
            'zipCode': '00300',
            'country': 'Sri Lanka',
        },
        'payment_details': {
            'cardholder': 'Puvanakopis Menahanathan',
            'cardNumber': '**** **** **** 4242',
            'expiry': '12/28',
        },
        'items': [
            {
                'product_id': 'product_01',
                'title': 'iPhone 16',
                'price': '329,900',
                'imageSrc': 'http://localhost:8000/uploads/70acff83-a4e5-42ea-b265-5eb1bd6076b0.png',
                'color': 'Black Titanium',
                'storage': '256GB',
                'quantity': 1,
            },
        ],
        'subtotal': 329900.0,
        'discount': 0.0,
        'shipping': 0.0,
        'tax': 27216.75,
        'total': 357116.75,
        'promo_code': None,
        'status': 'Confirmed',
        'payment': 'Paid',
        'created_at': datetime.fromisoformat('2026-09-06T17:14:02.604000'),
        'updated_at': datetime.fromisoformat('2026-09-06T17:14:02.605000'),
    },
    {
        '_id': 'order_17',
        'user_id': 'user_02',
        'customer_details': {
            'firstName': 'Puvanakopis',
            'lastName': 'Menahanathan',
            'email': 'puvanakopis@gmail.com',
            'phone': '0754614044',
        },
        'shipping_address': {
            'address': 'Sasthiriyar Road, Kaluthavalai 04, Batticaloa',
            'city': 'Colombo',
            'state': 'Western Province',
            'zipCode': '00300',
            'country': 'Sri Lanka',
        },
        'payment_details': {
            'cardholder': 'Puvanakopis Menahanathan',
            'cardNumber': '**** **** **** 4242',
            'expiry': '12/28',
        },
        'items': [
            {
                'product_id': 'product_02',
                'title': 'iPhone 14',
                'price': 'Rs. 379,900',
                'imageSrc': 'http://localhost:8000/uploads/434d5802-a657-4cde-b0d0-b162e91c5aeb.png',
                'color': 'Gold',
                'storage': '256GB',
                'quantity': 1,
            },
        ],
        'subtotal': 379900.0,
        'discount': 0.0,
        'shipping': 0.0,
        'tax': 31341.75,
        'total': 411241.75,
        'promo_code': None,
        'status': 'Confirmed',
        'payment': 'Paid',
        'created_at': datetime.fromisoformat('2026-09-07T07:29:00.379000'),
        'updated_at': datetime.fromisoformat('2026-09-07T07:29:00.379000'),
    },
]


SEED_DATA = {
    "counters": COUNTERS,
    "users": USERS,
    "products": PRODUCTS,
    "wishlists": WISHLISTS,
    "orders": ORDERS,
}


async def seed_database(drop_existing: bool = True):
    """
    Seed MongoDB database with all standalone initial data.
    """
    print(f"Connecting to MongoDB at {settings.MONGODB_URL}...")
    await connect_to_mongo()
    db = db_config.db

    print("\n--- Starting Database Seeding ---")

    for collection_name, documents in SEED_DATA.items():
        if not documents:
            continue

        collection = db[collection_name]

        if drop_existing:
            deleted = await collection.delete_many({})
            print(f"Cleared '{collection_name}' collection ({deleted.deleted_count} removed).")

        if documents:
            if drop_existing:
                result = await collection.insert_many(documents)
                print(f"Inserted {len(result.inserted_ids)} records into '{collection_name}'.")
            else:
                inserted_count = 0
                for doc in documents:
                    doc_id = doc.get("_id")
                    if doc_id:
                        await collection.replace_one({"_id": doc_id}, doc, upsert=True)
                        inserted_count += 1
                print(f"Upserted {inserted_count} records in '{collection_name}'.")

    print("\nSeeding completed successfully!")
    await close_mongo_connection()


if __name__ == "__main__":
    drop_mode = "--no-drop" not in sys.argv
    asyncio.run(seed_database(drop_existing=drop_mode))
