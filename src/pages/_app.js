import "@/styles/globals.css";
import "@/styles/shine-logo.css";
import "@/styles/global-loading.css";
import "@/styles/not-found.css";
import "@/styles/robot-loading.css";
import "@/styles/lonely-cat.css";
import "@/styles/ball-animation-logo.css";
import MainLayout from "@/components/MainLayout";
import { Provider } from "react-redux";
import store from "@/redux/store";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </Provider>
  );
}
