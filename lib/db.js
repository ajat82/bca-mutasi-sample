const mysql = require("mysql2/promise");
var format = require("date-format");
var bcrypt = require("bcrypt");
// OOP Javascript Function by Abdul Muttaqin
function kode(length) {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function foreach(arr, func) {
  for (var i in arr) {
    // await delay(2000);

    func(i, arr[i]);
  }
}
const createConnection = async () => {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "copymutasi",
  });
};

const masukanakun = async (user, pass) => {
  const connection = await createConnection();

  const login = connection.query(
    "SELECT * FROM akun WHERE username = ? AND password = ?",
    [user, pass],
    function (error, results, fields) {
      console.log(results);
    }
  );
  return login;
};

const mutasiakun = async (username, result, link) => {
  const connection = await createConnection();

  for (var i = 0; i < result.length; i++) {
    if (result[i].keterangan.includes("CR")) {
      await connection.execute(`INSERT INTO mutasi 
        (idakun, tanggal, keterangan , cab , nominal , mutasi , link ,kodemutasi) 
        VALUES ('${username}', '${result[i].tanggal}', '${result[i].keterangan}', '${result[i].cab}', '${result[i].nominal}','${result[i].mutasi}','${link}' , '');`);
    } else if (result[i].keterangan.includes("DB")) {
      await connection.execute(`INSERT INTO mutasi 
        (idakun, tanggal, keterangan , cab , nominal , mutasi , link,kodemutasi) 
        VALUES ('${username}', '${result[i].tanggal}', '${result[i].keterangan}', '${result[i].cab}', '${result[i].nominal}','${result[i].mutasi}','${link}', '');`);
    } else {
      await connection.execute(`INSERT INTO mutasi 
      (idakun, tanggal, keterangan , cab , nominal , mutasi , link,kodemutasi) 
      VALUES ('${username}', '${result[i].tanggal}', '${result[i].keterangan}', '${result[i].cab}', '${result[i].nominal}','${result[i].mutasi}','${link}', '');`);
    }
  }

  return "sukses";
};

const userlink = async (username) => {
  const connection = await createConnection();
  try {
    const login = connection.query(
      `SELECT * FROM mutasi WHERE idakun LIKE '${username}'`
    );
    return login;
  } catch (error) {
    return false;
  }
};

const checklink = async (link) => {
  const connection = await createConnection();

  const [info] = await connection.execute(
    `SELECT * FROM akun WHERE link LIKE '${link}'`
  );

  try {
    return info;
  } catch (error) {
    return false;
  }
};

const cekakun = async (user) => {
  const connection = await createConnection();

  const [info] = await connection.execute(
    `SELECT * FROM akun WHERE username='${user}'`
  );

  try {
    if (info.length > 3) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    return false;
  }
};

const insertakun = async (
  id,
  username,
  password,
  saldo,
  bank,
  norek,
  link,
  tanggalawal,
  bulanawal,
  tanggalakhir,
  bulanakhir
) => {
  const connection = await createConnection();

  const [info] = await connection.execute(`INSERT INTO akun 
  (id,username,password,saldo,bank,norek,link,tanggalawal,bulanawal,tanggalakhir,bulanakhir) 
  VALUES (NULL, '${username}', '${password}', '${saldo}', '${bank}','${norek}','${link}','${tanggalawal}',
  '${bulanawal}',
  '${tanggalakhir}','${bulanakhir}');`);
  return info;
};

const getakun = async (link) => {
  const connection = await createConnection();

  const [info] = await connection.execute(
    `SELECT * FROM akun WHERE username='${link}'`
  );

  try {
    return info;
  } catch (error) {
    return false;
  }
};

const newdate = async (user,tglawal,blnaawal,tglakhir,blnakhir) => {
  const connection = await createConnection();

  const [info] = await connection.execute(
    `UPDATE akun SET tanggalawal= '${tglawal}',bulanawal= '${blnaawal}',tanggalakhir= '${tglakhir}',bulanakhir= '${blnakhir}' WHERE akun.username='${user}'`
  );

  try {
    return info;
  } catch (error) {
    return false;
  }
};
const deleteakun = async (user) => {
  const connection = await createConnection();

  const [info] = await connection.execute(
    `DELETE FROM akun WHERE akun.username ='${user}'`
  );

  try {
    return info;
  } catch (error) {
    return false;
  }
};


module.exports = {
  createConnection,
  masukanakun,
  mutasiakun,
  userlink,
  checklink,
  insertakun,
  getakun,
  cekakun,
  newdate
};
