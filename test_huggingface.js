import axios from 'axios';
import 'dotenv/config';

// Thông tin model và token
// const MODEL_ID = "An-CNT/phobert-finetuned-viquad2";
const MODEL_ID = "timpal0l/mdeberta-v3-base-squad2";
const API_URL = `https://api-inference.huggingface.co/models/${MODEL_ID}`;
const HF_API_TOKEN = process.env.HF_TOKEN_API_KEY;

async function queryHuggingFaceAPI(question, context) {
    if (!HF_API_TOKEN) {
        console.error("Lỗi: Biến môi trường HF_TOKEN_API_KEY chưa được đặt.");
        throw new Error("HF_TOKEN_API_KEY is not set.");
    }

    const payload = {
        inputs: {
            question: question,
            context: context
        },
        options: {
            wait_for_model: true
        }
    };

    console.log(`Đang gửi yêu cầu đến: ${API_URL}`);
    console.log(`Payload: ${JSON.stringify(payload, null, 2)}`);

    try {
        const response = await axios.post(API_URL, payload, {
            headers: {
                "Authorization": `Bearer ${HF_API_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        console.log(`Status Code: ${response.status}`);
        return response.data;

    } catch (error) {
        console.error(`Lỗi khi gọi API Hugging Face: ${error.message}`);
        if (error.response) {
            console.error(`Status Code: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
            console.error(`Headers: ${JSON.stringify(error.response.headers, null, 2)}`);
        } else if (error.request) {
            console.error("Yêu cầu đã được gửi nhưng không nhận được phản hồi.");
            console.error(error.request);
        } else {
            console.error('Lỗi không xác định khi thiết lập yêu cầu.', error.message);
        }
        throw error;
    }
}

// --- Phần thực thi test ---
async function main() {
    const myQuestion = "PhoBERT được phát triển bởi đơn vị nào?";
    const myContext = "PhoBERT là một mô hình xử lý ngôn ngữ tự nhiên được phát triển bởi VinAI Research, một đơn vị nghiên cứu trí tuệ nhân tạo hàng đầu tại Việt Nam, dựa trên kiến trúc RoBERTa.";

    console.log("--- Bắt đầu kiểm tra API Hugging Face ---");

    if (!process.env.HF_TOKEN_API_KEY) {
        console.error("Vui lòng đặt biến môi trường HF_TOKEN_API_KEY trước khi chạy.");
        console.log("Ví dụ: export HF_TOKEN_API_KEY='hf_yourTokenHere'");
        return;
    }

    try {
        const result = await queryHuggingFaceAPI(myQuestion, myContext);
        console.log("\n--- Kết quả từ API ---");

        if (result && typeof result === 'object' && 'answer' in result) {
            console.log(`Câu trả lời: ${result.answer}`);
            console.log(`Độ tin cậy (score): ${result.score}`);
            console.log(`Vị trí bắt đầu: ${result.start}`);
            console.log(`Vị trí kết thúc: ${result.end}`);
        } else {
            console.log("Phản hồi không có trường 'answer' hoặc không phải là object mong đợi.");
            console.log(`Phản hồi đầy đủ: ${JSON.stringify(result, null, 2)}`);
        }

    } catch (error) {
        console.error("\n--- Kiểm tra API thất bại ---");
    }
}

// Chạy hàm main
main();