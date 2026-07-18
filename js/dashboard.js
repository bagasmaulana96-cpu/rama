// ======================================================
// FRESHKEEP DASHBOARD
// ======================================================

// ---------- DATA LIST ----------
const ikanList = [
    "Cakalang",
    "Bandeng",
    "Kakap",
    "Kerapu",
    "Tongkol",
    "Patin",
    "Nila",
    "Gurame",
    "Bawal"
];

const udangList = [
    "Udang Windu",
    "Udang Vaname",
    "Udang Galah",
    "Udang Tiger",
    "Udang Jerbung",
    "Udang Dogol"
];

// ==========================================
// MODE EDIT
// ==========================================

let editId = null;

let allData = [];

let currentPage = 1;

let currentTabFilter = "semua";

const rowsPerPage = 10;

// ==========================================
// UPDATE LIST PRODUK
// ==========================================

function updateList() {

    const jenis = document.getElementById("jenis_produk").value;
    const nama = document.getElementById("nama_produk");

    nama.innerHTML = "";

    if (jenis === "") {

        nama.innerHTML =
            "<option>-- Pilih jenis produk terlebih dahulu --</option>";

        document.getElementById("cekKesegaran").innerHTML =
            "<p style='font-size:12px;color:#888'>Pilih jenis produk terlebih dahulu</p>";

        return;
    }

    const list =
        jenis === "ikan"
            ? ikanList
            : udangList;

    list.forEach(item => {

        const option = document.createElement("option");

        option.value = item;
        option.textContent = item;

        nama.appendChild(option);

    });

    updateKesegaran(jenis);

}

// ==========================================
// UPDATE CEK KESEGARAN
// ==========================================

function updateKesegaran(jenis) {

    const c = document.getElementById("cekKesegaran");

    if (jenis === "ikan") {

        c.innerHTML = `

<b>1. Mata</b><br>

<label><input type="radio" name="mata"> Jernih</label>
<label><input type="radio" name="mata"> Keruh</label>
<label><input type="radio" name="mata"> Kusam</label>

<br><br>

<b>2. Insang</b><br>

<label><input type="radio" name="insang"> Merah Cerah</label>
<label><input type="radio" name="insang"> Kecoklatan</label>
<label><input type="radio" name="insang"> Abu-abu</label>

<br><br>

<b>3. Bau</b><br>

<label><input type="radio" name="bau"> Segar</label>
<label><input type="radio" name="bau"> Amis</label>
<label><input type="radio" name="bau"> Busuk</label>

<br><br>

<b>4. Tekstur</b><br>

<label><input type="radio" name="tekstur"> Kenyal</label>
<label><input type="radio" name="tekstur"> Lembek</label>
<label><input type="radio" name="tekstur"> Hancur</label>

`;

    } else {

        c.innerHTML = `

<b>1. Warna</b><br>

<label><input type="radio" name="warna"> Cerah</label>
<label><input type="radio" name="warna"> Kusam</label>
<label><input type="radio" name="warna"> Hitam</label>

<br><br>

<b>2. Bau</b><br>

<label><input type="radio" name="bau"> Segar</label>
<label><input type="radio" name="bau"> Amis</label>
<label><input type="radio" name="bau"> Busuk</label>

<br><br>

<b>3. Tekstur</b><br>

<label><input type="radio" name="tekstur"> Kenyal</label>
<label><input type="radio" name="tekstur"> Lembek</label>
<label><input type="radio" name="tekstur"> Hancur</label>

`;

    }

}

// ==========================================
// FORMAT RUPIAH
// ==========================================

function formatRupiah(input) {

    let angka = input.value.replace(/\D/g, "");

    angka = angka.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    input.value = angka;

}

// ==========================================
// LOGOUT
// ==========================================

function logout() {

    window.location.href = "index.html";

}

// ==========================================
// DOM LOADED
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formHasilLaut");

    form.addEventListener("submit", simpanData);

    loadData();

});

// ==========================================
// SIMPAN / UPDATE DATA
// ==========================================

async function simpanData(e) {

    e.preventDefault();

    const data = {

        nama_pemilik:
            document.getElementById("nama_pemilik").value,

        jenis_produk:
            document.getElementById("jenis_produk").value,

        nama_produk:
            document.getElementById("nama_produk").value,

        ukuran:
            document.getElementById("ukuran").value,

        tingkat_kesegaran:
            document.querySelector("input[name='kesegaran_final']:checked")?.value || "",

        total_berat:
            document.getElementById("total_berat").value,

        jumlah_box:
            Number(document.getElementById("jumlah_box").value),

        lokasi_penyimpanan:
            document.querySelector("input[name='gudang']:checked")?.value || "",

        harga_pengambilan:
            Number(
                document
                .getElementById("harga")
                .value
                .replace(/\./g, "")
            ),

        jenis_distribusi:
            document.getElementById("jenis_distribusi").value

    };

    // ============================
    // INSERT DATA BARU
    // ============================

    if (editId === null) {

        const { error } = await db

            .from("hasil_laut")

            .insert([data]);

        if (error) {

            console.log(error);

            alert("❌ Gagal menyimpan data");

            return;

        }

        alert("✅ Data berhasil disimpan");

    }

    // ============================
    // UPDATE DATA
    // ============================

    else {

        const { error } = await db

            .from("hasil_laut")

            .update(data)

            .eq("id", editId);

        if (error) {

            console.log(error);

            alert("❌ Gagal update");

            return;

        }

        alert("✅ Data berhasil diupdate");

        editId = null;

        document.getElementById("submitBtn").innerHTML =
            "Simpan Data";

    }

    resetForm();

    loadData();

}

// ==========================================
// RESET FORM
// ==========================================

function resetForm() {

    document.getElementById("formHasilLaut").reset();

    document.getElementById("cekKesegaran").innerHTML = `
        <p style="font-size:12px;color:#888;">
            Pilih jenis produk terlebih dahulu
        </p>
    `;

}

// ==========================================
// ISI FORM UNTUK EDIT
// ==========================================

async function editData(id) {

    const { data, error } = await db

        .from("hasil_laut")

        .select("*")

        .eq("id", id)

        .single();

    if (error) {

        console.log(error);

        return;

    }

    editId = id;

    document.getElementById("nama_pemilik").value =
        data.nama_pemilik;

    document.getElementById("jenis_produk").value =
        data.jenis_produk;

    updateList();

    document.getElementById("nama_produk").value =
        data.nama_produk;

    document.getElementById("ukuran").value =
        data.ukuran;

    document.getElementById("total_berat").value =
        data.total_berat;

    document.getElementById("jumlah_box").value =
        data.jumlah_box;

    document.getElementById("harga").value =
        Number(data.harga_pengambilan).toLocaleString("id-ID");

    document.getElementById("jenis_distribusi").value =
        data.jenis_distribusi;

    // radio kesegaran

    document.querySelectorAll(
        "input[name='kesegaran_final']"
    ).forEach(r => {

        r.checked =
            r.value === data.tingkat_kesegaran;

    });

    // radio gudang

    document.querySelectorAll(
        "input[name='gudang']"
    ).forEach(r => {

        r.checked =
            r.value === data.lokasi_penyimpanan;

    });

    document.getElementById("submitBtn").innerHTML =
        "Update Data";

    showInput();

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

// ==========================================
// NAVIGASI MENU
// ==========================================

function showInput() {

    document.getElementById("inputSection").style.display = "block";
    document.getElementById("dataSection").style.display = "none";

    document.getElementById("btnInput").classList.add("active");
    document.getElementById("btnData").classList.remove("active");

}

function showData() {

    document.getElementById("inputSection").style.display = "none";
    document.getElementById("dataSection").style.display = "block";

    document.getElementById("btnInput").classList.remove("active");
    document.getElementById("btnData").classList.add("active");

    loadData();

}

// ==========================================
// LOAD DATA DARI SUPABASE
// ==========================================

async function loadData(){

    const tbody=document.getElementById("tableData");

    tbody.innerHTML=`
    <tr>
        <td colspan="9">
            Loading...
        </td>
    </tr>`;

    const {data,error}=await db

    .from("hasil_laut")

    .select("*")

    .order("id");

    console.log("DATA :",data);

    console.log("ERROR :",error);

    if(error){

        tbody.innerHTML=`
        <tr>
            <td colspan="9">
                Gagal mengambil data
            </td>
        </tr>`;

        return;

    }

    allData=data;

    currentPage=1;

    updateStatistics(allData);

    applyFilters();

}

// ==========================================
// TAB FILTER (Semua / Ikan / Udang)
// ==========================================

function filterTab(tab, btnEl) {

    currentTabFilter = tab;

    document.querySelectorAll(".tab-btn").forEach(b =>
        b.classList.remove("active")
    );

    if (btnEl) btnEl.classList.add("active");

    currentPage = 1;

    applyFilters();

}

// ==========================================
// GABUNGAN FILTER TAB + PENCARIAN
// ==========================================

function applyFilters(){

    const keyword =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    let hasil = allData;

    if(currentTabFilter!="semua"){

        hasil = hasil.filter(item=>

            item.jenis_produk==currentTabFilter

        );

    }

    if(keyword!=""){

        hasil = hasil.filter(item=>

            item.nama_pemilik.toLowerCase().includes(keyword) ||

            item.nama_produk.toLowerCase().includes(keyword) ||

            item.jenis_produk.toLowerCase().includes(keyword)

        );

    }

    renderTable(hasil);

}

// ==========================================
// RENDER TABLE
// ==========================================

let currentFilteredData = [];

function renderTable(data){

    currentFilteredData = data;

    const tbody = document.getElementById("tableData");

    tbody.innerHTML = "";

    if(data.length==0){

        tbody.innerHTML=`
        <tr>
            <td colspan="9" style="text-align:center">
                Tidak ada data
            </td>
        </tr>`;

        return;
    }

    data.forEach(item=>{

        const icon =
            item.jenis_produk=="ikan"
            ? "🐟"
            : "🦐";

        tbody.innerHTML += `
        <tr>

            <td>
                <input type="checkbox" class="row-check">
            </td>

            <td>

                <div class="produk-cell">

                    <div class="produk-icon">
                        ${icon}
                    </div>

                    <div>

                        <b>${item.nama_produk}</b>

                        <br>

                        <small>
                            ${item.jenis_produk}
                        </small>

                    </div>

                </div>

            </td>

            <td>${item.nama_pemilik}</td>

            <td>${item.ukuran}</td>

            <td>

                ${item.total_berat}

                <br>

                <small>
                    ${item.jumlah_box} Box
                </small>

            </td>

            <td>${item.lokasi_penyimpanan}</td>

            <td>

                Rp
                ${Number(item.harga_pengambilan).toLocaleString("id-ID")}

            </td>

            <td>

                ${item.tingkat_kesegaran}

            </td>

            <td>

                <button onclick="editData(${item.id})">

                    ✏️

                </button>

                <button onclick="hapusData(${item.id})">

                    🗑️

                </button>

            </td>

        </tr>
        `;

    });

}

// ==========================================
// MENU TITIK-TIGA PER BARIS
// ==========================================

function toggleRowMenu(event, id) {

    event.stopPropagation();

    const menu = document.getElementById(`menu-${id}`);

    const isOpen = menu.classList.contains("open");

    document.querySelectorAll(".row-menu.open").forEach(m =>
        m.classList.remove("open")
    );

    if (!isOpen) menu.classList.add("open");

}

document.addEventListener("click", () => {

    document.querySelectorAll(".row-menu.open").forEach(m =>
        m.classList.remove("open")
    );

});

// ==========================================
// CHECKBOX "PILIH SEMUA"
// ==========================================

function toggleAllCheck(checkbox) {

    document.querySelectorAll(".row-check").forEach(c => {
        c.checked = checkbox.checked;
    });

}

// ==========================================
// EXPORT DATA KE CSV
// ==========================================

function exportData() {

    if (!allData.length) {

        alert("Belum ada data untuk diexport");

        return;
    }

    const header = [
        "Nama Pemilik", "Jenis Produk", "Nama Produk", "Ukuran",
        "Kesegaran", "Total Berat", "Jumlah Box", "Gudang",
        "Harga", "Distribusi"
    ];

    const rows = allData.map(item => [
        item.nama_pemilik,
        item.jenis_produk,
        item.nama_produk,
        item.ukuran,
        item.tingkat_kesegaran,
        item.total_berat,
        item.jumlah_box,
        item.lokasi_penyimpanan,
        item.harga_pengambilan,
        item.jenis_distribusi
    ]);

    const csv = [header, ...rows]
        .map(r => r.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data_gudang_freshkeep.csv";
    link.click();

}


// ==========================================
// PAGINATION
// ==========================================



// ==========================================
// NEXT PAGE
// ==========================================



// ==========================================
// PREVIOUS PAGE
// ==========================================



// ==========================================
// SEARCH
// ==========================================

function searchData(){

    currentPage = 1;

    applyFilters();

}

// ==========================================
// HAPUS DATA
// ==========================================

async function hapusData(id) {

    const yakin = confirm("Yakin ingin menghapus data ini?");

    if (!yakin) return;

    const { error } = await db
        .from("hasil_laut")
        .delete()
        .eq("id", id);

    if (error) {

        console.log(error);

        alert("❌ Gagal menghapus data");

        return;

    }

    alert("✅ Data berhasil dihapus");

    loadData();

}

// ==========================================
// CLOSE MODAL
// (Tidak dipakai lagi karena edit langsung di form)
// ==========================================

function closeModal() {

    const modal = document.getElementById("editModal");

    if (modal) {

        modal.style.display = "none";

    }

}

// ==========================================
// TUTUP MODAL SAAT KLIK DI LUAR
// ==========================================

window.onclick = function (event) {

    const modal = document.getElementById("editModal");

    if (!modal) return;

    if (event.target == modal) {

        closeModal();

    }

};

// ==========================================
// SELESAI
// ==========================================

console.log("=================================");
console.log(" FreshKeep Dashboard Loaded ");
console.log("=================================");

function updateStatistics(data){

    const totalData=document.getElementById("totalData");

    if(!totalData) return;

    document.getElementById("totalData").innerHTML=data.length;

    document.getElementById("totalIkan").innerHTML=

    data.filter(x=>x.jenis_produk=="ikan").length;

    document.getElementById("totalUdang").innerHTML=

    data.filter(x=>x.jenis_produk=="udang").length;

}