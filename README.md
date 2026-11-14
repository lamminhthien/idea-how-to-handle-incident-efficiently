# Quản lý & khắc phục sự cố Production

Slide thuyết trình một file HTML, có giọng đọc tự động.

Mở file `Quản lý & khắc phục sự cố Production.html` bằng trình duyệt, bấm **Thuyết trình**.
Giọng đọc lấy từ các file mp3 trong thư mục `audio/` (mỗi slide một file).
Nếu thiếu file mp3 thì trang tự đọc bằng giọng có sẵn của trình duyệt.

## Tạo lại giọng đọc (mp3)

Chỉ cần làm khi bạn sửa nội dung slide. Giọng dùng là `vi-VN-HoaiMyNeural` (nữ), qua thư viện
[edge-tts](https://github.com/rany2/edge-tts). Thư viện này miễn phí, không cần API key,
nhưng cần internet khi tạo file.

### 1. Yêu cầu

- Python 3.8 trở lên
- Node.js 18 trở lên

### 2. Cài edge-tts

Nên cài vào môi trường ảo (venv) để không ảnh hưởng Python của máy:

```bash
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install edge-tts
```

Kiểm tra cài thành công và xem danh sách giọng tiếng Việt:

```bash
edge-tts --list-voices | grep vi-VN
```

### 3. Tạo file mp3

Khi venv đang bật (`edge-tts` có trên PATH):

```bash
node tools/make-audio.mjs          # tạo cả 8 slide
node tools/make-audio.mjs 3 5      # chỉ tạo slide 3 và 5
```

Nếu không bật venv, trỏ thẳng tới lệnh:

```bash
EDGE_TTS=.venv/bin/edge-tts node tools/make-audio.mjs
```

Kết quả nằm ở `audio/slide-01.mp3` … `audio/slide-08.mp3`.

> Dịch vụ của Microsoft thỉnh thoảng trả lỗi `NoAudioReceived`. Script đã tự thử lại tối đa 8 lần,
> nên thấy thông báo lỗi giữa chừng là bình thường.

## Chỉnh giọng đọc

| Muốn chỉnh | Sửa ở đâu |
|---|---|
| Giọng nam thay vì nữ | `VOICE` trong `tools/make-audio.mjs` → `vi-VN-NamMinhNeural` |
| Tốc độ, cao độ | `RATE`, `PITCH` trong `tools/make-audio.mjs` (ví dụ `+15%`, `+2Hz`) |
| Cách đọc từ tiếng Anh (AWS, Kafka, server…) | bảng `PRON` trong file HTML |
| Lời đọc của từng slide | trường `n` của slide, và `p`, `t`, `v` của các card trong file HTML |

Sau khi sửa, chạy lại `node tools/make-audio.mjs` rồi tải lại trang.
