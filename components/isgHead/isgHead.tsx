/* eslint-disable @next/next/no-img-element */
import { ReactElement } from 'react'
import Head from 'next/head'
import { OrganizationLdJson } from '../layout/constants'

export const IsgHead = (): ReactElement => {
  return (
    <Head>
      <meta charSet="utf-8" />
      <link rel="preconnect" href="https://gstatic.com" />

      <script
        async
        key={`ld+json`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: OrganizationLdJson,
        }}
      />

      <script
        async
        dangerouslySetInnerHTML={{
          __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');
          fbq('track', 'PageView');
            `,
        }}
      />

      <noscript>
        <img
          alt=""
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}&noscript=1`}
        />
      </noscript>

      <script
        defer
        dangerouslySetInnerHTML={{
          __html: `
          !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
          },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
          a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
          twq('config','odpe9');
            `,
        }}
      />

      <script
        defer
        dangerouslySetInnerHTML={{
          __html: `
          _linkedin_partner_id = "4976281";
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            `,
        }}
      />

      <script
        defer
        dangerouslySetInnerHTML={{
          __html: `
          (function(l) {
            if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
            window.lintrk.q=[]}
            var s = document.getElementsByTagName("script")[0];
            var b = document.createElement("script");
            b.type = "text/javascript";b.async = true;
            b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
            s.parentNode.insertBefore(b, s);})(window.lintrk);
            `,
        }}
      />

      <noscript>
        <img
          alt=""
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://px.ads.linkedin.com/collect/?pid=4976281&fmt=gif`}
        />
      </noscript>
    </Head>
  )
}
