const mongoose = require("mongoose");

// MongoDB'ye bağlan
mongoose.connect(process.env.MONGODB_URI);

// Bağlantı başarılı olduğunda
mongoose.connection.on('connected', () => {
  console.log('MongoDB\'ye başarıyla bağlandı');
});

// Bağlantı hatası olduğunda
mongoose.connection.on('error', (err) => {
  console.error('MongoDB\'ye bağlanırken hata oluştu:', err);
});

// Bağlantı kapatıldığında
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB bağlantısı kapatıldı');
});

// Uygulama kapatıldığında MongoDB bağlantısını kapat
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Uygulama kapatıldı, MongoDB bağlantısı kapatılıyor');
    process.exit(0);
  });
});

