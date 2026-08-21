import os
import shutil
import zlib
import struct

assets_dir = r'e:/job_portal/job-portal/server/assets'

# Let's inspect signature bounds and crop it tightly
with open(os.path.join(assets_dir, 'img_obj_42_605x807_DeviceRGB.raw'), 'rb') as f:
    sig_rgb = f.read()
with open(os.path.join(assets_dir, 'img_obj_63_605x807_DeviceGray.raw'), 'rb') as f:
    sig_alpha = f.read()

w = 605
h = 807

min_x, max_x = w, 0
min_y, max_y = h, 0

for y in range(h):
    for x in range(w):
        a = sig_alpha[y * w + x]
        if a > 10: # non-transparent pixel
            if x < min_x: min_x = x
            if x > max_x: max_x = x
            if y < min_y: min_y = y
            if y > max_y: max_y = y

print(f"Signature bounding box: x=[{min_x}, {max_x}], y=[{min_y}, {max_y}]")

pad = 4
min_x = max(0, min_x - pad)
max_x = min(w - 1, max_x + pad)
min_y = max(0, min_y - pad)
max_y = min(h - 1, max_y + pad)

crop_w = max_x - min_x + 1
crop_h = max_y - min_y + 1

crop_rgba = bytearray()
for y in range(min_y, max_y + 1):
    crop_rgba.append(0)
    for x in range(min_x, max_x + 1):
        idx = y * w + x
        crop_rgba.extend([sig_rgb[idx*3], sig_rgb[idx*3+1], sig_rgb[idx*3+2], sig_alpha[idx]])

compressed = zlib.compress(bytes(crop_rgba), 9)
png_data = bytearray(b'\x89PNG\r\n\x1a\n')
ihdr = struct.pack('>IIBBBBB', crop_w, crop_h, 8, 6, 0, 0, 0)
png_data.extend(struct.pack('>I', len(ihdr)) + b'IHDR' + ihdr + struct.pack('>I', zlib.crc32(b'IHDR' + ihdr)))
png_data.extend(struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', zlib.crc32(b'IDAT' + compressed)))
png_data.extend(struct.pack('>I', 0) + b'IEND' + struct.pack('>I', zlib.crc32(b'IEND')))

sig_cropped_path = os.path.join(assets_dir, 'codeclub_signature.png')
with open(sig_cropped_path, 'wb') as f:
    f.write(png_data)
print(f"Saved cropped signature: {sig_cropped_path} ({crop_w}x{crop_h})")

# Copy logo and watermark to standardized names
shutil.copy(os.path.join(assets_dir, 'real_logo.png'), os.path.join(assets_dir, 'codeclub_logo.png'))
shutil.copy(os.path.join(assets_dir, 'real_watermark.png'), os.path.join(assets_dir, 'codeclub_watermark.png'))

# Copy to all client and server destinations
destinations = [
    r'e:/job_portal/job-portal/client/public/assets',
    r'e:/job_portal/certificate-verification/server/assets',
    r'e:/job_portal/certificate-verification/client/public/assets'
]

for d in destinations:
    os.makedirs(d, exist_ok=True)
    shutil.copy(os.path.join(assets_dir, 'codeclub_logo.png'), os.path.join(d, 'codeclub_logo.png'))
    shutil.copy(os.path.join(assets_dir, 'codeclub_signature.png'), os.path.join(d, 'codeclub_signature.png'))
    shutil.copy(os.path.join(assets_dir, 'codeclub_watermark.png'), os.path.join(d, 'codeclub_watermark.png'))
    print(f"Copied assets to: {d}")

print("Assets deployment complete!")
