import HomeContent from "@/components/widgets/home-content";

export default async function Home() {
  return (
    <div className="container lg:px-4 lg:mx-auto flex flex-col h-screen items-center justify-center">
      <HomeContent/>
    </div>
  );
}
