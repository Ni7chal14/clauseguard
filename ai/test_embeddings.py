from app.embeddings import embed_text


text = "Employees are entitled to 12 days of annual leave per year."

vector = embed_text(text)

print("Embedding created successfully!")
print("Vector dimensions:", len(vector))
print("First 5 values:", vector[:5])