import ContactForm from '@/app/ui/support/contact';

export default function Page () {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-8 px-4">
      <section id='contact' className=" w-full mb-16">
        <ContactForm />
      </section>
    </div>
  );
};