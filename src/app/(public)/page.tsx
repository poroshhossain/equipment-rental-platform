import {
  getCategories,
  getEquipmentList,
  getReviews,
} from "@/lib/api/ownerAction";
import Banner from "@/components/public/home/Banner";
import CategoriesSection from "@/components/public/home/CategoriesSection";
import FeaturedEquipment from "@/components/public/home/FeaturedEquipment";
import ReviewsSection from "@/components/public/home/ReviewsSection";
import WhyChooseUs from "@/components/public/home/WhyChooseUs";
import {
  HowItWorks,
  PopularEquipment,
  RecentlyAdded,
} from "@/components/public/home/ExtraSections";

// Content comes from the API on every request.
export const instant = false;

const HomePage = async () => {
  const [featured, popular, recent, categories, reviews] = await Promise.all([
    getEquipmentList({ status: "approved", limit: 6 }),
    getEquipmentList({ status: "approved", sort: "popular", limit: 6 }),
    getEquipmentList({ status: "approved", sort: "recent", limit: 6 }),
    getCategories(),
    getReviews(),
  ]);

  return (
    <>
      <Banner />
      <FeaturedEquipment items={featured} />
      <CategoriesSection items={categories} />
      <WhyChooseUs />
      <PopularEquipment items={popular} />
      <RecentlyAdded items={recent} />
      <HowItWorks />
      <ReviewsSection items={reviews} />
    </>
  );
};

export default HomePage;
