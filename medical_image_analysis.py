# ai-for-healthcare/medical_image_analysis.py

import torch
import torchvision
from torchvision import transforms
from PIL import Image

# Load pre-trained model for medical image classification
model = torchvision.models.resnet18(pretrained=True)
model.eval()

# Image preprocessing
image = Image.open("path_to_medical_image.jpg")
transform = transforms.Compose([transforms.Resize((224, 224)), transforms.ToTensor()])
image_tensor = transform(image).unsqueeze(0)

# Medical image classification
with torch.no_grad():
    output = model(image_tensor)

print(output)
