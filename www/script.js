document.addEventListener("DOMContentLoaded", async () => {
    if (Capacitor.isNativePlatform()) {
        await Capacitor.Plugins.LocalNotifications.requestPermissions();
    }
});

async function calculateDays() {
    let input = document.getElementById("birthday").value;
    let parts = input.split("/");

    if (parts.length !== 2) {
        document.getElementById("result").innerText = "⚠️ Nhập đúng định dạng dd/mm!";
        return;
    }

    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10);
    let today = new Date();
    let currentYear = today.getFullYear();
    
    let birthday = new Date(currentYear, month - 1, day);
    
    if (birthday < today) {
        birthday.setFullYear(currentYear + 1);
    }

    let diff = Math.ceil((birthday - today) / (1000 * 60 * 60 * 24));

    document.getElementById("result").innerText = `🎉 Còn ${diff} ngày nữa đến sinh nhật của bạn!`;

    if (Capacitor.isNativePlatform()) {
        await Capacitor.Plugins.LocalNotifications.schedule({
            notifications: [
                {
                    id: 1,
                    title: "Thông báo 🎂",
                    body: `Còn ${diff} ngày nữa đến sinh nhật của bạn!`,
                },
            ],
        });
    }
}

async function shareResult() {
    const resultText = document.getElementById("result").innerText;
    if (resultText && Capacitor.isNativePlatform()) {
        await Capacitor.Plugins.Share.share({
            title: "Đếm ngược sinh nhật",
            text: resultText,
            dialogTitle: "Chia sẻ kết quả"
        });
    }
}

async function getBatteryStatus() {
    try {
        const { Device } = Capacitor.Plugins;
        const batteryInfo = await Device.getBatteryInfo();

        document.getElementById("battery-status").innerText =
            `🔋 Mức pin: ${batteryInfo.batteryLevel * 100}% - ${batteryInfo.isCharging ? "Đang sạc" : "Không sạc"}`;
    } catch (error) {
        document.getElementById("battery-status").innerText = "❌ Không thể lấy thông tin pin!";
        console.error("Lỗi khi lấy trạng thái pin:", error);
    }
}

