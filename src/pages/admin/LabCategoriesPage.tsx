import { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import {
  TestTube,
  Search,
  Plus,
  MoreVertical,
  Beaker,
} from 'lucide-react';

export default function LabCategoriesPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch lab categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-lab-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lab_categories')
        .select('*')
        .order('name_ar');
      if (error) throw error;
      return data;
    },
  });

  const filteredCategories = categories?.filter(c =>
    c.name_ar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name_en?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {language === 'ar' ? 'فئات التحاليل' : 'Lab Categories'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? `${categories?.length || 0} فئة مسجلة`
                : `${categories?.length || 0} categories registered`
              }
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {language === 'ar' ? 'إضافة فئة' : 'Add Category'}
            </Button>
          </div>
        </div>

        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'قائمة الفئات' : 'Categories List'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
              </div>
            ) : filteredCategories && filteredCategories.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCategories.map(category => (
                  <div
                    key={category.id}
                    className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                        <Beaker className="h-5 w-5 text-info" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {language === 'ar' ? category.name_ar : category.name_en}
                        </h3>
                        {category.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {category.description}
                          </p>
                        )}
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <TestTube className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>{language === 'ar' ? 'لا توجد فئات' : 'No categories found'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
