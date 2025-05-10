import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-xl p-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white">
          <DialogTitle className="text-2xl font-bold">ڕێکخستنەکان</DialogTitle>
          <DialogDescription className="text-violet-100 opacity-90">
            تایبەتمەندی و زانیاری زیاتر دەربارەی سیستەمەکە
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="about" className="px-6 py-4">
          <TabsList className="w-full mb-4 bg-purple-50">
            <TabsTrigger value="about" className="flex-1">دەربارە</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">ڕێکخستن</TabsTrigger>
            <TabsTrigger value="support" className="flex-1">پشتگیری</TabsTrigger>
          </TabsList>
          
          {/* About Tab */}
          <TabsContent value="about" className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-purple-900 mb-2">زیرەکی دەستکردی قەڵا</h3>
              <p className="text-sm text-purple-800 leading-relaxed mb-2">
                ئەم سیستەمە لەسەر بنەمای مۆدێلی زیرەکی دەستکردی Cohere Command R+ دروستکراوە و تایبەتە 
                بۆ وەڵامدانەوەی پرسیارەکان بە زمانی کوردی سۆرانی، بە شێوەیەکی دەقاودەق.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                  Cohere Command R+
                </Badge>
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                  کوردی سۆرانی
                </Badge>
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                  React.js
                </Badge>
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                  Express.js
                </Badge>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-indigo-900 mb-2">تایبەتمەندییەکان</h3>
              <ul className="text-sm text-indigo-800 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="material-icons text-indigo-600 text-base">check_circle</span>
                  وەڵامدانەوە بە کوردی سۆرانی بۆ هەر پرسیارێک بە هەر زمانێک
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-icons text-indigo-600 text-base">check_circle</span>
                  وەڵامدانەوەی نوێکارانە و زیرەکانە بۆ پرسیارەکان
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-icons text-indigo-600 text-base">check_circle</span>
                  خێرایی بەرز و وەڵامدانەوەی ڕاستەوخۆ دەق بە دەق
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-icons text-indigo-600 text-base">check_circle</span>
                  ڕووکاری بەکارهێنەری سەردەمیانە و خۆش
                </li>
              </ul>
            </div>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-purple-900 mb-3">گۆڕانکاری زمان</h3>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-purple-200">
                <span className="text-sm text-purple-900">زمانی ڕووکار</span>
                <select className="bg-white border border-purple-200 rounded-lg p-2 text-sm text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="ckb">کوردی سۆرانی</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-indigo-900 mb-3">تایبەتمەندییەکانی چات</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-indigo-200">
                  <div>
                    <span className="text-sm text-indigo-900 block">دەنگدانەوەی خۆکار</span>
                    <span className="text-xs text-indigo-600">خۆکار پاککردنەوەی چات دوای ٢٤ کاتژمێر</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-indigo-200">
                  <div>
                    <span className="text-sm text-indigo-900 block">ناساندنەوەی زمان</span>
                    <span className="text-xs text-indigo-600">پیشاندانی ئاگاداری کاتێک زمانی ناکوردی بەکار دەهێنیت</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked value="" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Support Tab */}
          <TabsContent value="support" className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-purple-900 mb-2">پەیوەندی کردن</h3>
              <p className="text-sm text-purple-800 leading-relaxed mb-3">
                بۆ پەیوەندی کردن یان ڕاپۆرتکردنی کێشەیەک، تکایە ئیمەیل بنێرە بۆ:
              </p>
              <div className="bg-white p-3 rounded-lg border border-purple-200 flex items-center gap-2">
                <span className="material-icons text-purple-500">email</span>
                <a href="mailto:support@example.com" className="text-purple-700 hover:text-purple-900 underline underline-offset-2">
                  support@example.com
                </a>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-indigo-900 mb-2">زانیاری وەشان</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-indigo-800">وەشانی سیستەم</span>
                  <span className="text-indigo-600 font-bold">1.0.0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-indigo-800">دوایین نوێکردنەوە</span>
                  <span className="text-indigo-600">٢٠٢٥/٠٥/١٠</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-indigo-800">مۆدێلی زیرەکی دەستکرد</span>
                  <span className="text-indigo-600">Cohere Command R+ v2</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="bg-gray-50 p-4 border-t border-gray-100">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            داخستن
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;