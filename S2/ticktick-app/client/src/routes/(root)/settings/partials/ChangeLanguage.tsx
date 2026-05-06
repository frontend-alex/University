import ToggleLanguageButton from "@/components/ui/toggle-language"

const ChangeLanguage = () => {
  return (
    <div className="grid-3 gap-5 lg:gap-0">
      <div className="flex-col-1">
        <h1 className="font-bold text-xl">Language</h1>
        <p className="text-stone-400 text-sm">Change your language.</p>
      </div>
      <div className="col-span-2 lg:w-3/5">
        <ToggleLanguageButton />
      </div>
    </div>
  );
}

export default ChangeLanguage