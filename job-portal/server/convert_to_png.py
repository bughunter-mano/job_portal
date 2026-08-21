import os
import zlib
import struct

assets_dir = r'e:/job_portal/job-portal/server/assets'

def save_png_rgba(width, height, rgb_data, alpha_data, out_filename):
    raw_rgba = bytearray()
    for y in range(height):
        raw_rgba.append(0) # filter byte for scanline
        for x in range(width):
            idx = y * width + x
            rgb_idx = idx * 3
            r = rgb_data[rgb_idx]
            g = rgb_data[rgb_idx + 1]
            b = rgb_data[rgb_idx + 2]
            a = alpha_data[idx] if alpha_data else 255
            raw_rgba.extend([r, g, b, a])
            
    compressed = zlib.compress(bytes(raw_rgba), 9)
    
    png_data = bytearray(b'\x89PNG\r\n\x1a\n')
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0) # 8-bit RGBA
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    png_data.extend(struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc))
    
    # IDAT chunk
    idat_crc = zlib.crc32(b'IDAT' + compressed)
    png_data.extend(struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc))
    
    # IEND chunk
    iend_crc = zlib.crc32(b'IEND')
    png_data.extend(struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc))
    
    out_path = os.path.join(assets_dir, out_filename)
    with open(out_path, 'wb') as f:
        f.write(png_data)
    print(f"Successfully generated: {out_path} ({width}x{height})")

# 1. Logo (Object 41 RGB + Object 62 Alpha)
with open(os.path.join(assets_dir, 'img_obj_41_400x400_DeviceRGB.raw'), 'rb') as f:
    logo_rgb = f.read()
with open(os.path.join(assets_dir, 'img_obj_62_400x400_DeviceGray.raw'), 'rb') as f:
    logo_alpha = f.read()
save_png_rgba(400, 400, logo_rgb, logo_alpha, 'real_logo.png')

# 2. Signature (Object 42 RGB + Object 63 Alpha)
with open(os.path.join(assets_dir, 'img_obj_42_605x807_DeviceRGB.raw'), 'rb') as f:
    sig_rgb = f.read()
with open(os.path.join(assets_dir, 'img_obj_63_605x807_DeviceGray.raw'), 'rb') as f:
    sig_alpha = f.read()
save_png_rgba(605, 807, sig_rgb, sig_alpha, 'real_signature.png')

# 3. Watermark (Object 66/72 RGB + Object 73/83 Alpha)
with open(os.path.join(assets_dir, 'img_obj_66_900x900_DeviceRGB.raw'), 'rb') as f:
    wm_rgb = f.read()
with open(os.path.join(assets_dir, 'img_obj_73_900x900_DeviceGray.raw'), 'rb') as f:
    wm_alpha = f.read()
save_png_rgba(900, 900, wm_rgb, wm_alpha, 'real_watermark.png')

print("All real assets converted to PNG!")
