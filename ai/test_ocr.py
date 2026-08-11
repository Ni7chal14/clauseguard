import os

os.environ["FLAGS_enable_pir_api"] = "0"
os.environ["FLAGS_use_mkldnn"] = "0"

from paddleocr import PaddleOCR

pdf_path = "test_data/sample_policy.pdf"

ocr = PaddleOCR(
    lang="en",  
    use_doc_orientation_classify=False,
    use_doc_unwarping=False,
    use_textline_orientation=False,
)

result = ocr.predict(pdf_path)

for res in result:
    res.print()