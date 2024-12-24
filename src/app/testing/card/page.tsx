import { AI } from "@/app/(server-action)/action-single";
import { ProductCardContainer } from "@/components/kratos/product-card-container";

export default function TestingPage() {
  const products = {
    data: [
      {
        title:
          'ACER Nitro V 15 ANV15 41 R2VJ RTX2050 AMD Ryzen 5 7535HS 8/512GB SSD W11 OHS 15.6" FHD 144Hz Black',
        image:
          "https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/10/23/0c118088-e612-415d-8992-a3f5b41bf5ff.jpg.webp?ect=4g",
        price: "Rp10.149.000",
        rating: "5.0",
        sold: "18 terjual",
        link: "https://www.tokopedia.com/acer-jakarta/acer-nitro-v-15-anv15-41-r2vj-rtx2050-amd-ryzen-5-7535hs-8-512gb-ssd-w11-ohs-15-6-fhd-144hz-black-laptop-8-512gb-ssd-36ccb?extParam=ivf%3Dfalse%26keyword%3Dacer+nitro+5%26search_id%3D202412221212036F870ECFDD2DAB33BKRG%26src%3Dsearch",
        store: {
          name: "Acer Authorized Store Jakarta",
          location: "Jakarta Utara",
          isOfficial: true,
        },
      },
      {
        title:
          'ACER Nitro V 15 ANV15 41 R99D RTX3050 AMD Ryzen 5 6600H 8/512GB SSD W11 OHS 15.6" FHD 165Hz Black',
        image:
          "https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/11/16/cacd72dc-f162-45cb-9173-a861a321b388.jpg.webp?ect=4g",
        price: "Rp10.949.000",
        rating: "5.0",
        sold: "18 terjual",
        link: "https://www.tokopedia.com/acer-jakarta/acer-nitro-v-15-anv15-41-r99d-rtx3050-amd-ryzen-5-6600h-8-512gb-ssd-w11-ohs-15-6-fhd-165hz-black-laptop-8-512gb-ssd-b48d0?extParam=ivf%3Dfalse%26keyword%3Dacer+nitro+5%26search_id%3D202412221212036F870ECFDD2DAB33BKRG%26src%3Dsearch",
        store: {
          name: "Acer Authorized Store Jakarta",
          location: "Jakarta Utara",
          isOfficial: true,
        },
      },
      {
        title:
          'ACER Nitro V 15 ANV15-41 RTX3050 RYZEN 5 6600H 8GB 512GB w11 15" 144hz',
        image:
          "https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/11/15/11887816-0aa8-4db5-bb65-c228fca00880.jpg.webp?ect=4g",
        price: "Rp10.999.000",
        rating: "5.0",
        sold: "18 terjual",
        link: "https://www.tokopedia.com/agresid/acer-nitro-v-15-anv15-41-rtx3050-ryzen-5-6600h-8gb-512gb-w11-15-144hz-non-bundle-windows-11-home-67aac?extParam=ivf%3Dfalse%26keyword%3Dacer+nitro+5%26search_id%3D202412221212036F870ECFDD2DAB33BKRG%26src%3Dsearch",
        store: {
          name: "AGRES ID",
          location: "Jakarta Utara",
          isOfficial: true,
        },
      },
      {
        title:
          "Acer Nitro V 15 ANV15-5 i5-13420H 16GB 512GB RTX 2050 W11 OHS 144Hz",
        image:
          "https://images.tokopedia.net/img/cache/200-square/VqbcmM/2023/10/2/cd91f883-e161-424f-99ba-555ac5cf239b.jpg.webp?ect=4g",
        price: "Rp10.209.000",
        rating: "5.0",
        sold: "24 terjual",
        link: "https://www.tokopedia.com/acerid/acer-nitro-v-15-anv15-5-i5-13420h-16gb-512gb-rtx-2050-w11-ohs-144hz-8-gb-dd79a?extParam=ivf%3Dtrue%26keyword%3Dacer+nitro+5%26search_id%3D202412221212036F870ECFDD2DAB33BKRG%26src%3Dsearch",
        store: {
          name: "Acer Official Authorized Store",
          location: "Jakarta Pusat",
          isOfficial: true,
        },
      },
      {
        title:
          "ACER Nitro 5 Gaming Intel i7 11800H 16GB 512GB RTX3050Ti 144Hz W11 EX",
        image:
          "https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/9/22/b6300ce6-c6cc-4183-9d64-7a6576212a37.jpg.webp?ect=4g",
        price: "Rp10.699.000",
        rating: "5.0",
        sold: "14 terjual",
        link: "https://www.tokopedia.com/gudanglaptop/acer-nitro-5-gaming-intel-i7-11800h-16gb-512gb-rtx3050ti-144hz-w11-ex-i5-g13-rtx2050-16gb-512gb-ssd-8fdfd?extParam=ivf%3Dfalse%26keyword%3Dacer+nitro+5%26search_id%3D202412221212036F870ECFDD2DAB33BKRG%26src%3Dsearch",
        store: {
          name: "Gudang Laptop ID",
          location: "Depok",
          isOfficial: false,
        },
      },
      {
        title:
          'ACER Nitro V 15 ANV15 41 R2VJ RTX2050 AMD Ryzen 5 7535HS 8/512GB SSD W11 OHS 15.6" FHD 144Hz Black',
        image:
          "https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/10/23/0c118088-e612-415d-8992-a3f5b41bf5ff.jpg.webp?ect=4g",
        price: "Rp10.149.000",
        rating: "5.0",
        sold: "18 terjual",
        link: "https://www.tokopedia.com/acer-jakarta/acer-nitro-v-15-anv15-41-r2vj-rtx2050-amd-ryzen-5-7535hs-8-512gb-ssd-w11-ohs-15-6-fhd-144hz-black-laptop-8-512gb-ssd-36ccb?extParam=ivf%3Dfalse%26keyword%3Dacer+nitro+5%26search_id%3D202412221212036F870ECFDD2DAB33BKRG%26src%3Dsearch",
        store: {
          name: "Acer Authorized Store Jakarta",
          location: "Jakarta Utara",
          isOfficial: true,
        },
      },
    ],
  };

  return (
    <AI>
      <div className="pt-20">
        <div className="px-8 sm:px-12 pt-12 md:pt-14 pb-14 md:pb-24 max-w-3xl mx-auto flex flex-col space-y-3 md:space-y-4">
          <ProductCardContainer content={products} isFinished />
        </div>
      </div>
    </AI>
  );
}
