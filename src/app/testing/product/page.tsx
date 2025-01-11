/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils";
import { Fragment } from "react";
import {
  FlaskConical,
  Grip,
  MoveRight,
  PackageSearch,
  Plus,
} from "lucide-react";
import Link from "next/link";

type DynamicFlatUIProps = {
  data: Record<string, any>[];
  callId: string;
};

const sanitizeStr = (url: string) => {
  const isUrl = url.startsWith("https://");
  if (isUrl) {
    return (
      <div className="rounded-[2rem] block my-2 w-fit px-4 hover:rotate-6 transition-all">
        <Link href={url} target="_blank" rel="noopener noreferrer">
          <img
            src={url}
            alt={`review-${url}`}
            className="size-[8rem] object-cover rounded-3xl"
          />
        </Link>
      </div>
    );
  }
  return (
    <div className="rounded-[2rem] my-1 w-fit bg-[#4A4947] py-3 px-4">
      <div className="flex items-center space-x-2">
        <MoveRight className="size-5" /> <p>{url}</p>
      </div>
    </div>
  );
};

const sanitizeKeyName = (input: string) => {
  return input
    ? input
        .split("_")
        .filter(Boolean)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    : "there-is-no-keys";
};

const DynamicFlatUI = ({ data }: DynamicFlatUIProps) => {
  const renderValue = (
    value: any,
    key: string,
    className?: string
  ): JSX.Element => {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return (
        <div className="px-4 mb-2 flex lg:items-center flex-wrap">
          <div className="rounded-[2rem] bg-muted py-3 px-4 shrink-0 mr-1">
            <p className="font-medium">{sanitizeKeyName(key)}:</p>
          </div>
          <div
            className={cn("rounded-[2rem] bg-[#4A4947] py-3 px-4", className)}
          >
            <p>{String(value)}</p>
          </div>
        </div>
      );
    } else if (Array.isArray(value)) {
      return (
        <div className="my-3">
          <div className="rounded-[2rem] w-fit bg-[#1A1A1D] py-3 pl-4 pr-20 my-2">
            <div className="flex items-center space-x-2 text-white">
              <Plus className="size-5" />
              <p className="font-semibold text-sm">{sanitizeKeyName(key)}:</p>
            </div>
          </div>
          <div className="">
            {value.map((item, index) => (
              <div key={`${key}-${index}`}>
                {typeof item === "object" ? (
                  <div className="">
                    {Object.entries(item).map(([subKey, subValue]) => (
                      <Fragment key={`${key}-${index}-${subKey}`}>
                        {renderValue(subValue, subKey)}
                      </Fragment>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-start">
                    {sanitizeStr(String(item))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    } else if (typeof value === "object" && value !== null) {
      return (
        <div className="my-3">
          <div className="rounded-[2rem] w-fit bg-[#FBF5E5] py-3 pl-4 pr-20 my-2">
            <div className="flex items-center space-x-2 text-black">
              <Grip className="size-5" />
              <p className="font-semibold text-sm">{sanitizeKeyName(key)}:</p>
            </div>
          </div>
          <div className="my-2">
            {Object.entries(value).map(([subKey, subValue]) => (
              <Fragment key={`${key}-${subKey}`}>
                {renderValue(subValue, subKey)}
              </Fragment>
            ))}
          </div>
        </div>
      );
    }
    return <p className="text-sm">{key}: (Unsupported data type)</p>;
  };

  return (
    <div className="shadow-md rounded-lg p-6 max-w-3xl mx-auto my-8">
      <div className="flex items-center space-x-3">
        <FlaskConical className="size-6" />
        <h2 className="text-md font-bold mb-2">Experimental Product Insight</h2>
      </div>
      <div className="space-y-6 *:text-sm ">
        {data.map((item, index) => (
          <div
            key={index}
            className="border-t pt-4 first:border-t-0 first:pt-0"
          >
            <div className="rounded-[2rem] w-fit bg-[#FBF5E5] py-3 pl-4 pr-20 my-3">
              <div className="flex items-center space-x-2 text-black">
                <PackageSearch className="size-5" />
                <p className="font-semibold text-sm">Product</p>
              </div>
            </div>
            <div className="space-y-3">
              {Object.entries(item).map(([key, value]) => (
                <Fragment key={key}>{renderValue(value, key)}</Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const data = {
  product_name: "dbE W100 2.4Ghz Three Mode Wireless Gaming Headphone",
  product_price: "Rp399.000",
  product_discount: "60%",
  original_price: "Rp1.000.000",
  total_sold: "1 rb+",
  product_rating: "4.9",
  total_ratings: "595",
  product_details: {
    condition: "Baru",
    minimum_order: "1 Buah",
    category: "Bluetooth Headphone",
  },
  product_description:
    "W100 memiliki koneksi unggulan berupa wireless 2.4ghz dengan Dongle Type-C yang dapat digunakan di smartphone, PS4(dongle usb dipasang di konsol), Nintendo Switch (pakai dongle type C) dan di PC (dengan adaptor). jenis koneksi ini sudah banyak digunakan oleh pemain professional di ajang kompetitif akhir akhir ini karena sudah tidak terasa memiliki delay.\n\nselain koneksi 2.4Ghz, dbE W100 memiliki koneksi lain berupa Bluetooth V5.3 yang stabil dan mudah digunakan, dan yang terakhir dbE W100 juga memiliki koneksi kabel dengan jack 3.5mm.\n\nUntuk menghasilkan kualitas suara maksimal, dbE W100 menggunakan special custom driver berukuran 50mm. Kualitas suara yang dihasilkan natural, dengan detail dan staging baik.\n\nW100 memiliki Mircrophone berkualitas tinggi dengan sensitivitas tinggi. Hasil suaranya natural tanpa noise sehingga sangat cocok digunakan untuk meeting online, discord atau bermain game online. Saat tidak digunakan, microphone ini bisa dilipat ke atas.\n\ndbE W100 memiliki ukuran earpad overear bebentuk oval dengan ukuran 10.5 cm x 8.5 cm. Size earphone ini sangat nyaman digunakan karena melingkupi seluruh daun telinga.",
  product_specifications: {
    connections: ["2.4 Ghz", "Bluetooth V 5.3", "3.5mm"],
    driver: "50mm Special Costum Driver",
    frequency_response: "20 Hz – 20 kHz",
    sensitivity: "122 dB +- 3 dB",
    battery_capacity: "800 mAh",
    battery_life: "25 – 30 Jam",
    headphone_weight: "225 gr",
  },
  compatible_consoles: ["Switch", "Playstation 4", "Playstation 5", "PC"],
  notes:
    "Jika penggunaan menggunakan Dongle di PC/Laptop direkomendasikan dipasang di USB HUB agar tidak mengintervensi sinyal WIFI\n\nTidak compatible ke xbox jika menggunakan kabel baru bisa",
  product_reviews: [
    {
      review_date: "10 bulan lalu",
      reviewer: "A\\*\\*\\*n",
      review_text:
        "oke barangnya bagus, rekomendid. sepadan dengan harga. yang sangat teramat disayangkan ekpedisi JN\\* sangat lemot tidak satset, foto bukti pengiriman juga bukan ditempat s... Selengkapnya",
      review_images: [
        "https://images.tokopedia.net/img/cache/200-square/bjFkPX/2024/3/13/70a28296-e09f-4808-953d-e43818e356fe.jpg.webp?ect=4g",
        "https://images.tokopedia.net/img/cache/200-square/bjFkPX/2024/3/13/debc093b-4e67-4bdd-847b-325f8fae3a9e.jpg.webp?ect=4g",
        "https://images.tokopedia.net/img/cache/200-square/bjFkPX/2024/3/13/8649e95a-a800-4e64-aae2-23a984118937.jpg.webp?ect=4g",
        "https://images.tokopedia.net/img/cache/200-square/bjFkPX/2024/3/13/935b83c0-59f0-4c0a-b651-fb6966899f4a.jpg.webp?ect=4g",
      ],
      helpful_count: "3",
    },
    {
      review_date: "2 bulan lalu",
      reviewer: "D\\*\\*\\*s",
      review_text:
        "Alhamdulillah, headphone gaming nya sudah mendarat dengan selamat.\nTerima kasih banyak seller :)",
      review_images: [
        "https://images.tokopedia.net/img/cache/200-square/bjFkPX/2024/11/5/7efdc771-a405-47ba-9e67-343edc8d482b.jpg.webp?ect=4g",
        "https://images.tokopedia.net/img/cache/200-square/bjFkPX/2024/11/5/6e5d857d-06e1-48c7-8139-e9874b493230.jpg.webp?ect=4g",
      ],
      helpful_count: "3",
    },
    {
      review_date: "11 bulan lalu",
      reviewer: "Alfian",
      review_text:
        "Desainnya cakep, keren bisa 3 mode bluetooth, adapter, jack, suaranya bagus, ringan",
      review_images: [
        "https://images.tokopedia.net/img/cache/200-square/bjFkPX/2024/2/2/2749ea34-7460-4df9-a4db-89085a3b2986.jpg.webp?ect=4g",
        "https://images.tokopedia.net/img/cache/200-square/bjFkPX/2024/2/2/f1e53026-0d21-4426-8302-caf32ddbb736.jpg.webp?ect=4g",
      ],
      helpful_count: "4",
    },
    {
      review_date: "9 bulan lalu",
      reviewer: "Z\\*\\*\\*l",
      review_text:
        "Pemakaiaan kurang lebih setengah bulan aman g ada delay batre juga awet ( 2-3 hari) koneksi ke mobile juga aman, cuma blm ada aplikasinya aja buat setting/monitoring bate... Selengkapnya",
      review_images: [],
      helpful_count: "1",
    },
    {
      review_date: "9 bulan lalu",
      reviewer: "Sebastian",
      review_text:
        "Fast respond n shipping. Barang sesuai dengan deskripsi produk. Suara oke, khas dbe, konektivitas lanjay. Keep the good work 👍",
      review_images: [
        "https://images.tokopedia.net/img/cache/200-square/bjFkPX/2024/3/28/745f2014-89f2-47cc-b6d7-dd87d8b93320.jpg.webp?ect=4g",
        "https://images.tokopedia.net/img/cache/200-square/bjFkPX/2024/3/28/5f231815-ece1-4897-953b-ef41cd0d9941.jpg.webp?ect=4g",
        "https://images.tokopedia.net/img/cache/200-square/bjFkPX/2024/3/28/0efe23e0-003d-4efe-a5b2-a6009e7f51c4.jpg.webp?ect=4g",
      ],
      helpful_count: "2",
    },
  ],
};

export default function Page() {
  return (
    <div>
      <div>
        <DynamicFlatUI data={[data]} callId={"123ABC"} />
      </div>
    </div>
  );
}
