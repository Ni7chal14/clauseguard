from app.loaders import load_document

file_path = "test_data/text_policy.txt"

text = load_document(file_path)

print("----- EXTRACTED TEXT -----")
print(text)
print("--------------------------")