import os
from PIL import Image, ImageDraw

def improve_background(image_path, output_path):
    try:
        img = Image.open(image_path).convert("RGBA")
        width, height = img.size
        
        # We start from the edges and flood-fill the alpha channel to 0
        # This v2 uses a higher tolerance and more seed points to handle textures
        data = img.load()
        
        # Seed points: All pixels along the edges (top, bottom, left, right)
        # This ensures we catch backgrounds that aren't perfectly square
        seeds = []
        for x in range(0, width, 10): # Every 10 pixels to speed up
            seeds.append((x, 0))
            seeds.append((x, height - 1))
        for y in range(0, height, 10):
            seeds.append((0, y))
            seeds.append((width - 1, y))
        
        for seed in seeds:
            # We use a higher tolerance (50-70) to catch grains/textures
            # but stay below the black line threshold
            ImageDraw.floodfill(img, seed, (0, 0, 0, 0), thresh=65)
            
        img.save(output_path, "PNG")
        print(f"Refined {image_path}")
    except Exception as e:
        print(f"Failed to refine {image_path}: {e}")

images_to_process = [
    "images/anywhere_girl.png",
    "images/gojo_peek.png",
    "images/gojo_hi.png",
    "images/gojo_emotional.png",
    "images/gojo_cake.png",
    "images/gojo_eat.png",
    "images/gojo_gift_2.png",
    "images/slap.png",
    "images/gojo_cry.png",
    "images/girl_comfort.png",
    "images/gojo_hug_attempt.png",
    "images/push.png",
    "images/dont use.png",
    "images/hand_kiss.png",
    "images/gojo_run.png"
]

for img_path in images_to_process:
    if os.path.exists(img_path):
        temp_path = img_path + ".v2.png"
        improve_background(img_path, temp_path)
        if os.path.exists(temp_path):
            os.replace(temp_path, img_path)
