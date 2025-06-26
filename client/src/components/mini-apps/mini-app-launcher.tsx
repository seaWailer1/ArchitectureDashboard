import { FaCar, FaShoppingBag, FaBolt, Grid3X3 } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { t } from "@/lib/i18n";

export default function MiniAppLauncher() {
  const { toast } = useToast();

  const miniApps = [
    {
      id: "ride",
      name: t('ride'),
      icon: FaCar,
      color: "bg-blue-100 text-blue-600",
      description: "Ride-hailing service",
    },
    {
      id: "shop",
      name: t('shop'),
      icon: FaShoppingBag,
      color: "bg-green-100 text-green-600",
      description: "E-commerce platform",
    },
    {
      id: "bills",
      name: t('bills'),
      icon: FaBolt,
      color: "bg-yellow-100 text-yellow-600",
      description: "Utility bill payments",
    },
    {
      id: "more",
      name: t('more'),
      icon: Grid3X3,
      color: "bg-neutral-100 text-neutral-600",
      description: "More apps",
    },
  ];

  const handleAppLaunch = (appId: string, appName: string) => {
    toast({
      title: "Coming Soon",
      description: `${appName} mini-app will be available soon`,
    });
  };

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">{t('servicesApps')}</h2>
        <Button variant="ghost" className="text-primary text-sm font-medium p-0 h-auto">
          {t('explore')}
        </Button>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {miniApps.map((app) => {
          const Icon = app.icon;
          return (
            <Button
              key={app.id}
              variant="ghost"
              className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all h-auto"
              onClick={() => handleAppLaunch(app.id, app.name)}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${app.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-neutral-900 text-center">
                {app.name}
              </span>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
