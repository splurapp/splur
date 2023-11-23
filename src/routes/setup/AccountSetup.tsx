function AccountCard({ name, amount }: { name: string; amount: number }) {
  return (
    <div className="card card-compact text-primary-content bg-primary join-item">
      <div className="card-body flex-row justify-between">
        <div>
          <h2 className="card-title">{name}</h2>
          <p>{amount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</p>
        </div>
        <button className="btn btn-circle btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M12.8995 6.85431L17.1421 11.0969L7.24264 20.9964H3V16.7538L12.8995 6.85431ZM14.3137 5.44009L16.435 3.31877C16.8256 2.92825 17.4587 2.92825 17.8492 3.31877L20.6777 6.1472C21.0682 6.53772 21.0682 7.17089 20.6777 7.56141L18.5563 9.68273L14.3137 5.44009Z"
              fill="rgba(255,255,255,1)"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function AccountSetup() {
  return (
    <main className="p-3 flex flex-col gap-5 h-screen py-6 px-5">
      <section>
        <h1 className="text-4xl font-medium text-primary-content">Let's setup your account!</h1>
        <p className="text-base text-secondary-content">
          Account can be your bank, credit card or your wallet.
        </p>
      </section>

      <section className="join join-vertical gap-2">
        <AccountCard name={"Bank"} amount={100} />
        <AccountCard name={"Cash"} amount={405} />
      </section>

      <section className="mt-auto join join-vertical">
        <button className="btn btn-neutral w-full join-item">Add wallet</button>
        <button className="btn btn-primary w-full join-item">Continue</button>
      </section>
    </main>
  );
}
