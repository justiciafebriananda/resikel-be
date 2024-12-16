-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 08, 2024 at 03:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_resikel`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_area_transaksi_wilayah`
--

CREATE TABLE `tb_area_transaksi_wilayah` (
  `id` int(10) NOT NULL,
  `nama_wilayah` varchar(255) NOT NULL,
  `jumlah_user` int(255) NOT NULL,
  `jumlah_transaksi` int(255) NOT NULL,
  `total_sampah` int(255) NOT NULL,
  `total_reward` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_area_transaksi_wilayah`
--

INSERT INTO `tb_area_transaksi_wilayah` (`id`, `nama_wilayah`, `jumlah_user`, `jumlah_transaksi`, `total_sampah`, `total_reward`) VALUES
(1, 'Batam Kota', 25, 20, 120, 230000),
(2, 'Sekupang', 10, 20, 120, 230000),
(3, 'Sagulung', 10, 20, 120, 230000),
(4, 'Lubuk Baja', 5, 20, 120, 250000),
(5, 'Nongsa', 5, 20, 120, 240000);

-- --------------------------------------------------------

--
-- Table structure for table `tb_jenis_sampah`
--

CREATE TABLE `tb_jenis_sampah` (
  `id` int(255) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `kode` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_jenis_sampah`
--

INSERT INTO `tb_jenis_sampah` (`id`, `nama`, `kode`, `keterangan`) VALUES
(2, 'Kertas', 'KRT', 'Kertas Bungkus'),
(5, 'Plastik', 'PLS', 'Pot, Botol Minum'),
(7, 'Botol', 'BTL', '-'),
(8, 'Elektronik', 'ELK', '-'),
(9, 'Besi dan Logam', 'BSL', '-');

-- --------------------------------------------------------

--
-- Table structure for table `tb_uom`
--

CREATE TABLE `tb_uom` (
  `id` int(255) NOT NULL,
  `nama_uom` varchar(255) NOT NULL,
  `satuan` varchar(255) NOT NULL,
  `faktor_konversi` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_uom`
--

INSERT INTO `tb_uom` (`id`, `nama_uom`, `satuan`, `faktor_konversi`) VALUES
(1, 'Kilogram', 'KG', 1),
(2, 'Meter', 'M', 2),
(8, 'Gram', 'g', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) NOT NULL,
  `nama` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `role` varchar(25) NOT NULL,
  `point` int(255) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `role`, `point`, `password`) VALUES
(2, 'Justicia Febriananda', 'justi@gmail.com', 'Admin', 5000, '123123'),
(3, 'Ahmad Iqbal', 'iqbal@gmail.com', 'User', 205, '123123'),
(5, 'Sasa', 'sasa@gmail.com', 'User', 3400, '123123'),
(6, 'Liyan', 'liyan@gmail.com', 'Admin', 4200, '123123'),
(7, 'Karenina', 'karenina@gmail.com', 'Admin', 3401, '123123'),
(8, 'Ricky', 'ricky@gmail.com', 'Admin', 4323, '123123');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_area_transaksi_wilayah`
--
ALTER TABLE `tb_area_transaksi_wilayah`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_jenis_sampah`
--
ALTER TABLE `tb_jenis_sampah`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_uom`
--
ALTER TABLE `tb_uom`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_area_transaksi_wilayah`
--
ALTER TABLE `tb_area_transaksi_wilayah`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tb_jenis_sampah`
--
ALTER TABLE `tb_jenis_sampah`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tb_uom`
--
ALTER TABLE `tb_uom`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
