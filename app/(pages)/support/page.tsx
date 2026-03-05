import ContactForm from '@/app/ui/support/contact';

export default function Page () {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-8 px-4">
      <h1 className='text-center text-4xl my-4 px-3 font-bold'>Support</h1>
      <p className='text-light mb-5'>
        Fill out the form below to get support for any issues.
      </p>
      <section id='contact' className=" w-full mb-16">
        <ContactForm />
      </section>
    </div>
  );
};