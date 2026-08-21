import zlib
import re
import os
import struct

pdf_path = r'e:/job_portal/job-portal/server/Zaigham_Web.pdf'
out_dir = r'e:/job_portal/job-portal/server/assets'
os.makedirs(out_dir, exist_ok=True)

with open(pdf_path, 'rb') as f:
    content = f.read()

# Find all XObject Image objects
# Pattern matches: obj_num 0 obj ... << ... /Type /XObject ... /Subtype /Image ... >> stream ... endstream
pattern = re.compile(rb'(\d+)\s+(\d+)\s+obj\s*<<\s*(.*?)\s*>>\s*stream\r?\n(.*?)\r?\nendstream', re.DOTALL)

for match in pattern.finditer(content):
    obj_num = match.group(1).decode('latin1')
    dict_str = match.group(3).decode('latin1')
    stream_data = match.group(4)
    
    if '/Subtype /Image' in dict_str or '/Subtype/Image' in dict_str:
        print(f"--- Object {obj_num} ---")
        print("Dict:", dict_str)
        
        # Parse width, height, colorspace, bitspercomponent, filter
        w_m = re.search(r'/Width\s+(\d+)', dict_str)
        h_m = re.search(r'/Height\s+(\d+)', dict_str)
        cs_m = re.search(r'/ColorSpace\s+/([A-Za-z0-9]+)', dict_str)
        bpc_m = re.search(r'/BitsPerComponent\s+(\d+)', dict_str)
        filter_m = re.search(r'/Filter\s+/([A-Za-z0-9]+)', dict_str)
        smask_m = re.search(r'/SMask\s+(\d+)\s+\d+\s+R', dict_str)
        
        width = int(w_m.group(1)) if w_m else None
        height = int(h_m.group(1)) if h_m else None
        colorspace = cs_m.group(1) if cs_m else 'DeviceRGB'
        bpc = int(bpc_m.group(1)) if bpc_m else 8
        is_flate = '/FlateDecode' in dict_str
        is_dct = '/DCTDecode' in dict_str
        
        raw_bytes = stream_data
        if is_flate:
            try:
                raw_bytes = zlib.decompress(stream_data)
            except Exception as e:
                print(f"Decompress error: {e}")
                
        print(f"Width: {width}, Height: {height}, CS: {colorspace}, BPC: {bpc}, Filter: {'DCT' if is_dct else 'Flate' if is_flate else 'None'}, SMask: {smask_m.group(1) if smask_m else 'None'}, Bytes: {len(raw_bytes)}")
        
        if is_dct:
            # JPEG file
            jpeg_path = os.path.join(out_dir, f"img_obj_{obj_num}.jpg")
            with open(jpeg_path, 'wb') as jf:
                jf.write(raw_bytes)
            print(f"Saved JPEG: {jpeg_path}")
        else:
            raw_path = os.path.join(out_dir, f"img_obj_{obj_num}_{width}x{height}_{colorspace}.raw")
            with open(raw_path, 'wb') as rf:
                rf.write(raw_bytes)
            print(f"Saved RAW: {raw_path}")

print("Extraction complete!")
