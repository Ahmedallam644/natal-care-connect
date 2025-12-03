-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('patient', 'doctor', 'admin');

-- Create profiles table linked to auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role app_role NOT NULL DEFAULT 'patient',
  full_name TEXT,
  phone TEXT,
  email TEXT,
  language_preference TEXT DEFAULT 'ar',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  specialty TEXT,
  hospital_id UUID,
  license_number TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctor_codes table for patient linking
CREATE TABLE public.doctor_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  linked_doctor_id UUID REFERENCES public.doctors(id),
  date_of_birth DATE,
  blood_type TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pregnancy_history table
CREATE TABLE public.pregnancy_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  pregnancy_number INTEGER DEFAULT 1,
  last_menstrual_period DATE,
  expected_due_date DATE,
  is_current BOOLEAN DEFAULT true,
  outcome TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create symptoms table
CREATE TABLE public.symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  pregnancy_id UUID REFERENCES public.pregnancy_history(id),
  symptom_type TEXT NOT NULL,
  severity INTEGER CHECK (severity >= 1 AND severity <= 10),
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fmc_records (Fetal Movement Count) table
CREATE TABLE public.fmc_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  pregnancy_id UUID REFERENCES public.pregnancy_history(id),
  kick_count INTEGER NOT NULL,
  duration_minutes INTEGER,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Create hospitals table
CREATE TABLE public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key to doctors for hospital
ALTER TABLE public.doctors ADD CONSTRAINT doctors_hospital_fk FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id);

-- Create lab_categories table
CREATE TABLE public.lab_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lab_orders table
CREATE TABLE public.lab_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES public.doctors(id) NOT NULL,
  category_id UUID REFERENCES public.lab_categories(id),
  test_name_ar TEXT NOT NULL,
  test_name_en TEXT NOT NULL,
  instructions TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  ordered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date DATE
);

-- Create lab_results table
CREATE TABLE public.lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.lab_orders(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  result_value TEXT,
  result_file_url TEXT,
  notes TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by_doctor BOOLEAN DEFAULT false,
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create ai_risk_scores table
CREATE TABLE public.ai_risk_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  pregnancy_id UUID REFERENCES public.pregnancy_history(id),
  preeclampsia_risk DECIMAL(5, 2),
  gestational_diabetes_risk DECIMAL(5, 2),
  anemia_risk DECIMAL(5, 2),
  preterm_birth_risk DECIMAL(5, 2),
  fetal_growth_restriction_risk DECIMAL(5, 2),
  overall_risk_level TEXT CHECK (overall_risk_level IN ('low', 'moderate', 'high', 'critical')),
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Create notifications_log table
CREATE TABLE public.notifications_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title_ar TEXT,
  title_en TEXT,
  message_ar TEXT,
  message_en TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pregnancy_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fmc_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications_log ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to get current user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = _user_id
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Doctors can view patient profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'doctor'));

-- RLS Policies for doctors
CREATE POLICY "Doctors can view own record" ON public.doctors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Doctors can update own record" ON public.doctors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage doctors" ON public.doctors FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for doctor_codes
CREATE POLICY "Doctors can manage own codes" ON public.doctor_codes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.doctors WHERE id = doctor_id AND user_id = auth.uid())
);
CREATE POLICY "Anyone can view active codes" ON public.doctor_codes FOR SELECT USING (is_active = true);

-- RLS Policies for patients
CREATE POLICY "Patients can view own record" ON public.patients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Patients can update own record" ON public.patients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Patients can insert own record" ON public.patients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Doctors can view linked patients" ON public.patients FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.doctors WHERE id = linked_doctor_id AND user_id = auth.uid())
);

-- RLS Policies for pregnancy_history
CREATE POLICY "Patients can manage own pregnancy history" ON public.pregnancy_history FOR ALL USING (
  EXISTS (SELECT 1 FROM public.patients WHERE id = patient_id AND user_id = auth.uid())
);
CREATE POLICY "Doctors can view linked patient pregnancy" ON public.pregnancy_history FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.patients p 
    JOIN public.doctors d ON p.linked_doctor_id = d.id 
    WHERE p.id = patient_id AND d.user_id = auth.uid()
  )
);

-- RLS Policies for symptoms
CREATE POLICY "Patients can manage own symptoms" ON public.symptoms FOR ALL USING (
  EXISTS (SELECT 1 FROM public.patients WHERE id = patient_id AND user_id = auth.uid())
);
CREATE POLICY "Doctors can view linked patient symptoms" ON public.symptoms FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.patients p 
    JOIN public.doctors d ON p.linked_doctor_id = d.id 
    WHERE p.id = patient_id AND d.user_id = auth.uid()
  )
);

-- RLS Policies for fmc_records
CREATE POLICY "Patients can manage own FMC records" ON public.fmc_records FOR ALL USING (
  EXISTS (SELECT 1 FROM public.patients WHERE id = patient_id AND user_id = auth.uid())
);
CREATE POLICY "Doctors can view linked patient FMC" ON public.fmc_records FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.patients p 
    JOIN public.doctors d ON p.linked_doctor_id = d.id 
    WHERE p.id = patient_id AND d.user_id = auth.uid()
  )
);

-- RLS Policies for hospitals (public read)
CREATE POLICY "Anyone can view hospitals" ON public.hospitals FOR SELECT USING (true);
CREATE POLICY "Admins can manage hospitals" ON public.hospitals FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for lab_categories (public read)
CREATE POLICY "Anyone can view lab categories" ON public.lab_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage lab categories" ON public.lab_categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for lab_orders
CREATE POLICY "Patients can view own lab orders" ON public.lab_orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.patients WHERE id = patient_id AND user_id = auth.uid())
);
CREATE POLICY "Doctors can manage lab orders for linked patients" ON public.lab_orders FOR ALL USING (
  EXISTS (SELECT 1 FROM public.doctors WHERE id = doctor_id AND user_id = auth.uid())
);

-- RLS Policies for lab_results
CREATE POLICY "Patients can manage own lab results" ON public.lab_results FOR ALL USING (
  EXISTS (SELECT 1 FROM public.patients WHERE id = patient_id AND user_id = auth.uid())
);
CREATE POLICY "Doctors can view linked patient results" ON public.lab_results FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.patients p 
    JOIN public.doctors d ON p.linked_doctor_id = d.id 
    WHERE p.id = patient_id AND d.user_id = auth.uid()
  )
);
CREATE POLICY "Doctors can update result review status" ON public.lab_results FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.patients p 
    JOIN public.doctors d ON p.linked_doctor_id = d.id 
    WHERE p.id = patient_id AND d.user_id = auth.uid()
  )
);

-- RLS Policies for ai_risk_scores
CREATE POLICY "Patients can view own risk scores" ON public.ai_risk_scores FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.patients WHERE id = patient_id AND user_id = auth.uid())
);
CREATE POLICY "Doctors can view linked patient risk scores" ON public.ai_risk_scores FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.patients p 
    JOIN public.doctors d ON p.linked_doctor_id = d.id 
    WHERE p.id = patient_id AND d.user_id = auth.uid()
  )
);
CREATE POLICY "System can insert risk scores" ON public.ai_risk_scores FOR INSERT WITH CHECK (true);

-- RLS Policies for notifications_log
CREATE POLICY "Users can view own notifications" ON public.notifications_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications_log FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications_log FOR INSERT WITH CHECK (true);

-- Create trigger for profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'patient')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();