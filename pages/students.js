import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import useWindowDimensions from "../hooks/useWindowDimensions";
import styles from "../styles/Home.module.css";
import { delay } from "../helpers/functions";
import useInterval from "../hooks/useInterval";

const BASE_URL = "https://placement.iitm.ac.in/api";
const RETRY_TIME = 10000;
const UNIT_TIME = 1000;

const SignInSchema = Yup.object().shape({
  rollNumber: Yup.string()
    .length(8, "Invalid Roll Number")
    .required("Required!"),
  studentPassword: Yup.string().required("Required!"),
});

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const Home = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [companiesData, setCompaniesData] = useState([]);
  const [delayLoad, setDelayLoad] = useState(false);
  const [retryTime, setRetryTime] = useState(RETRY_TIME);

  useInterval(() => {
    setRetryTime(retryTime - UNIT_TIME);
  }, UNIT_TIME);

  const getCompaniesData = async (token) => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + "/getallcompanylist", {
        headers: {
          tokenizer: token,
        },
      });
      setLoading(false);

      if (res.status === 200) {
        if (res.data?.status === "invalid")
          return alert("Something went wrong!");

        if (res.data?.length > 0) setCompaniesData(res.data);
      }
    } catch (ex) {
      console.log(ex);
      setLoading(false);
      if (ex?.response?.status === 429) {
        setRetryTime(RETRY_TIME);

        setDelayLoad(true);
        await delay(RETRY_TIME);
        setDelayLoad(false);

        await getCompaniesData(token);
      }
    }
  };

  const handleSubmitForm = async (values) => {
    try {
      const data_to_send = {
        rollNumber: values.rollNumber.toUpperCase(),
        studentPassword: values.studentPassword,
      };

      setLoading(true);
      const res = await axios.post(
        BASE_URL + "/checkstudentlogin",
        data_to_send
      );
      setLoading(false);

      if (res?.data?.status === "success" && res?.data?.token) {
        setUserData(res.data);
        getCompaniesData(res.data.token);
      } else alert("Invalid credentials!");
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  };

  const dateTimeFormat = (date, time) => {
    if (!(date && time)) return "-";

    return date + ", " + time;
  };

  if (userData)
    return (
      <div>
        <div className={styles.userInfo}>
          <div>
            <div className={styles.userName}>
              Hi,{" "}
              {userData.name.substring(0, 20) +
                (userData.name.length > 20 ? "..." : "")}
            </div>
            <div className={styles.userRoll}>{`(${userData.rollno})`}</div>
          </div>

          <div
            className={styles.btn}
            onClick={() => {
              setUserData(null);
              router.push("/");
            }}
          >
            Log Out
          </div>
        </div>

        {delayLoad && (
          <div className={styles.errorText} style={{ textAlign: "center" }}>
            Status 429, retrying in {Math.floor(retryTime / 1000)}s...
          </div>
        )}

        {loading && <div className={styles.loader}>Loading Companies...</div>}

        {companiesData?.length > 0 && (
          <div className={styles.companiesTable}>
            {companiesData.map((company, i) => (
              <div key={i} className={styles.company}>
                <div className={styles.companyName}>{company.companyName}</div>
                <div className={styles.companyProfile}>
                  {company.profileName}
                </div>

                <div className={styles.rdContainer}>
                  <div className={styles.rdTitle}>Resume Deadline : </div>
                  <div className={styles.rd}>{company.resumeDeadline}</div>
                </div>

                <div className={styles.rdContainer}>
                  <div className={styles.rdInnerContainer1}>
                    <div className={styles.rdTitle}>PPT</div>
                    <div className={styles.rd}>
                      {dateTimeFormat(company.pptDate, company.pptTime)}
                    </div>
                  </div>
                  <div className={styles.rdInnerContainer2}>
                    <div className={styles.rdTitle}>Test</div>
                    <div className={styles.rd}>
                      {dateTimeFormat(company.testDate, company.testTime)}
                    </div>
                  </div>
                </div>

                <div className={styles.rdContainer}>
                  <div className={styles.rdInnerContainer1}>
                    <div className={styles.rdTitle}>GD</div>
                    <div className={styles.rd}>
                      {dateTimeFormat(company.gdDate, company.gdTime)}
                    </div>
                  </div>
                  <div className={styles.rdInnerContainer2}>
                    <div className={styles.rdTitle}>Interview</div>
                    <div className={styles.rd}>
                      {dateTimeFormat(
                        company.interviewDate,
                        company.interviewTime
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.backArrow}>
          <ArrowBackIcon onClick={() => router.push("/")} />
        </div>

        <Image
          src="/icons/icon.png"
          alt="placement_logo"
          height={150}
          width={150}
        />

        {loading && <div className={styles.loader}>Loading...</div>}

        <Formik
          initialValues={{
            rollNumber: "",
            studentPassword: "",
          }}
          validationSchema={SignInSchema}
          onSubmit={handleSubmitForm}
        >
          {({
            errors,
            touched,
            submitForm,
            dirty,
            isValid,
            values,
            handleChange,
          }) => (
            <Form>
              <div className={styles.form}>
                <div className={styles.formTitle}>Student Login</div>

                <div className={styles.textField}>
                  <TextField
                    name="rollNumber"
                    id="rollNumber"
                    label="Roll Number"
                    value={values.rollNumber}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                  />
                </div>
                {errors.rollNumber && touched.rollNumber ? (
                  <div className={styles.errorText}>{errors.rollNumber}</div>
                ) : null}

                <div className={styles.textField}>
                  <TextField
                    label="Password"
                    name="studentPassword"
                    id="studentPassword"
                    value={values.studentPassword}
                    onChange={handleChange}
                    type="password"
                    variant="outlined"
                    size="small"
                  />
                </div>
                {errors.studentPassword && touched.studentPassword ? (
                  <div className={styles.errorText}>
                    {errors.studentPassword}
                  </div>
                ) : null}

                <div
                  type="submit"
                  onClick={submitForm}
                  className={isValid && dirty ? styles.btn : styles.btnDisabled}
                >
                  Submit
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </main>
    </div>
  );
};

export default Home;
