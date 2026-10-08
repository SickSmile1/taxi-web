import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { buildHreflang, OG_LOCALE } from '@/lib/hreflang';
import { getTranslation, LANGS, type Lang } from '@/lib/translations';

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = getTranslation(lang as Lang);
  return {
    title: t.meta_datenschutz_title,
    description: t.meta_datenschutz_desc,
    alternates: {
      canonical: `/${lang}/datenschutz/`,
      languages: buildHreflang('datenschutz/'),
    },
    openGraph: {
      title: t.meta_datenschutz_title,
      description: t.meta_datenschutz_desc,
      locale: OG_LOCALE[lang as Lang],
    },
  };
}

export default async function DatenschutzPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getTranslation(lang as Lang);
  const langLinks = Object.fromEntries(
    LANGS.map((l) => [l, `/${l}/datenschutz/`]),
  ) as Record<Lang, string>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Datenschutzerklärung',
    description: t.meta_datenschutz_desc,
    url: `https://taxi-alica.de/${lang}/datenschutz/`,
    inLanguage: lang,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="page-wrapper">
        <Header t={t} lang={lang as Lang} langLinks={langLinks} />

        <main className="legal-main">
          <div className="section-tag">Rechtliches · Datenschutz</div>
          <h1 className="legal-h1">Datenschutzerklärung</h1>
          <p
            style={{
              fontSize: 14,
              color: 'var(--text-faint)',
              marginBottom: 32,
            }}
          >
            Fassung 18.08.2026-313233152
          </p>

          {/* Einleitung und Überblick */}
          <section style={{ marginBottom: 32 }}>
            <h2 className="legal-h2">Einleitung und Überblick</h2>
            <p className="legal-p">
              Wir haben diese Datenschutzerklärung (Fassung
              18.08.2026-313233152) verfasst, um Ihnen gemäß der Vorgaben der
              Datenschutz-Grundverordnung (EU) 2016/679 und anwendbaren
              nationalen Gesetzen zu erklären, welche personenbezogenen Daten
              (kurz Daten) wir als Verantwortliche – und die von uns
              beauftragten Auftragsverarbeiter (z. B. Provider) – verarbeiten,
              zukünftig verarbeiten werden und welche rechtmäßigen Möglichkeiten
              Sie haben. Die verwendeten Begriffe sind geschlechtsneutral zu
              verstehen.
            </p>
            <div className="legal-callout">
              <strong style={{ color: 'var(--text-primary)' }}>
                Kurz gesagt:
              </strong>{' '}
              Wir informieren Sie umfassend über Daten, die wir über Sie
              verarbeiten.
            </div>
            <p className="legal-p">
              Datenschutzerklärungen klingen für gewöhnlich sehr technisch und
              verwenden juristische Fachbegriffe. Diese Datenschutzerklärung
              soll Ihnen hingegen die wichtigsten Dinge so einfach und
              transparent wie möglich beschreiben. Soweit es der Transparenz
              förderlich ist, werden technische Begriffe leserfreundlich
              erklärt, Links zu weiterführenden Informationen geboten und
              Grafiken zum Einsatz gebracht. Wir informieren damit in klarer und
              einfacher Sprache, dass wir im Rahmen unserer Geschäftstätigkeiten
              nur dann personenbezogene Daten verarbeiten, wenn eine
              entsprechende gesetzliche Grundlage gegeben ist. Das ist sicher
              nicht möglich, wenn man möglichst knappe, unklare und
              juristisch-technische Erklärungen abgibt, so wie sie im Internet
              oft Standard sind, wenn es um Datenschutz geht. Ich hoffe, Sie
              finden die folgenden Erläuterungen interessant und informativ und
              vielleicht ist die eine oder andere Information dabei, die Sie
              noch nicht kannten.
            </p>
            <p className="legal-p">
              Wenn trotzdem Fragen bleiben, möchten wir Sie bitten, sich an die
              unten bzw. im Impressum genannte verantwortliche Stelle zu wenden,
              den vorhandenen Links zu folgen und sich weitere Informationen auf
              Drittseiten anzusehen. Unsere Kontaktdaten finden Sie
              selbstverständlich auch im Impressum.
            </p>
          </section>

          {/* Anwendungsbereich */}
          <section style={{ marginBottom: 32 }}>
            <h2 className="legal-h2">Anwendungsbereich</h2>
            <p className="legal-p">
              Diese Datenschutzerklärung gilt für alle von uns im Unternehmen
              verarbeiteten personenbezogenen Daten und für alle
              personenbezogenen Daten, die von uns beauftragte Firmen
              (Auftragsverarbeiter) verarbeiten. Mit personenbezogenen Daten
              meinen wir Informationen im Sinne des Art. 4 Nr. 1 DSGVO wie zum
              Beispiel Name, E-Mail-Adresse und postalische Anschrift einer
              Person. Die Verarbeitung personenbezogener Daten sorgt dafür, dass
              wir unsere Dienstleistungen und Produkte anbieten und abrechnen
              können, sei es online oder offline. Der Anwendungsbereich dieser
              Datenschutzerklärung umfasst:
            </p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: '14px 0 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {[
                'alle Onlineauftritte (Websites, Onlineshops), die wir betreiben',
                'Social Media Auftritte und E-Mail-Kommunikation',
                'mobile Apps für Smartphones und andere Geräte',
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    fontSize: 15,
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span style={{ color: 'var(--gold)', fontSize: 18 }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="legal-callout">
              <strong style={{ color: 'var(--text-primary)' }}>
                Kurz gesagt:
              </strong>{' '}
              Die Datenschutzerklärung gilt für alle Bereiche, in denen
              personenbezogene Daten im Unternehmen über die genannten Kanäle
              strukturiert verarbeitet werden. Sollten wir außerhalb dieser
              Kanäle mit Ihnen in Rechtsbeziehungen eintreten, werden wir Sie
              gegebenenfalls gesondert informieren.
            </div>
          </section>

          {/* Rechtsgrundlagen */}
          <section style={{ marginBottom: 32 }}>
            <h2 className="legal-h2">Rechtsgrundlagen</h2>
            <p className="legal-p">
              In der folgenden Datenschutzerklärung geben wir Ihnen transparente
              Informationen zu den rechtlichen Grundsätzen und Vorschriften,
              also den Rechtsgrundlagen der Datenschutz-Grundverordnung, die uns
              ermöglichen, personenbezogene Daten zu verarbeiten.
            </p>
            <p className="legal-p">
              Was das EU-Recht betrifft, beziehen wir uns auf die VERORDNUNG
              (EU) 2016/679 DES EUROPÄISCHEN PARLAMENTS UND DES RATES vom 27.
              April 2016. Diese Datenschutz-Grundverordnung der EU können Sie
              selbstverständlich online auf EUR-Lex, dem Zugang zum EU-Recht,
              unter{' '}
              <a
                href="https://eur-lex.europa.eu/legal-content/DE/ALL/?uri=celex%3A32016R0679"
                target="_blank"
                rel="noopener noreferrer"
                className="legal-link"
              >
                https://eur-lex.europa.eu/legal-content/DE/ALL/?uri=celex%3A32016R0679
              </a>{' '}
              nachlesen.
            </p>
            <p className="legal-p">
              Wir verarbeiten Ihre Daten nur, wenn mindestens eine der folgenden
              Bedingungen zutrifft:
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                margin: '18px 0 24px',
              }}
            >
              <div className="legal-card">
                <h3 className="legal-h3" style={{ margin: '0 0 8px' }}>
                  Einwilligung (Artikel 6 Absatz 1 lit. a DSGVO)
                </h3>
                <p className="legal-p" style={{ margin: 0 }}>
                  Sie haben uns Ihre Einwilligung gegeben, Daten zu einem
                  bestimmten Zweck zu verarbeiten. Ein Beispiel wäre die
                  Speicherung Ihrer eingegebenen Daten eines Kontaktformulars.
                </p>
              </div>

              <div className="legal-card">
                <h3 className="legal-h3" style={{ margin: '0 0 8px' }}>
                  Vertrag (Artikel 6 Absatz 1 lit. b DSGVO)
                </h3>
                <p className="legal-p" style={{ margin: 0 }}>
                  Um einen Vertrag oder vorvertragliche Verpflichtungen mit
                  Ihnen zu erfüllen, verarbeiten wir Ihre Daten. Wenn wir zum
                  Beispiel einen Kaufvertrag mit Ihnen abschließen, benötigen
                  wir vorab personenbezogene Informationen.
                </p>
              </div>

              <div className="legal-card">
                <h3 className="legal-h3" style={{ margin: '0 0 8px' }}>
                  Rechtliche Verpflichtung (Artikel 6 Absatz 1 lit. c DSGVO)
                </h3>
                <p className="legal-p" style={{ margin: 0 }}>
                  Wenn wir einer rechtlichen Verpflichtung unterliegen,
                  verarbeiten wir Ihre Daten. Zum Beispiel sind wir gesetzlich
                  verpflichtet Rechnungen für die Buchhaltung aufzuheben. Diese
                  enthalten in der Regel personenbezogene Daten.
                </p>
              </div>

              <div className="legal-card">
                <h3 className="legal-h3" style={{ margin: '0 0 8px' }}>
                  Berechtigte Interessen (Artikel 6 Absatz 1 lit. f DSGVO)
                </h3>
                <p className="legal-p" style={{ margin: 0 }}>
                  Im Falle berechtigter Interessen, die Ihre Grundrechte nicht
                  einschränken, behalten wir uns die Verarbeitung
                  personenbezogener Daten vor. Wir müssen zum Beispiel gewisse
                  Daten verarbeiten, um unsere Website sicher und wirtschaftlich
                  effizient betreiben zu können. Diese Verarbeitung ist somit
                  ein berechtigtes Interesse.
                </p>
              </div>
            </div>

            <p className="legal-p">
              Weitere Bedingungen wie die Wahrnehmung von Aufgaben im
              öffentlichen Interesse und Ausübung öffentlicher Gewalt sowie dem
              Schutz lebenswichtiger Interessen treten bei uns in der Regel
              nicht auf. Soweit eine solche Rechtsgrundlage doch einschlägig
              sein sollte, wird diese an der entsprechenden Stelle ausgewiesen.
            </p>
            <p className="legal-p">
              Zusätzlich zu der EU-Verordnung gelten auch noch nationale
              Gesetze:
            </p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: '12px 0 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <li
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontSize: 15,
                  color: 'var(--text-secondary)',
                }}
              >
                <span style={{ color: 'var(--gold)', fontSize: 18 }}>•</span>
                <span>
                  In Österreich ist dies das Bundesgesetz zum Schutz natürlicher
                  Personen bei der Verarbeitung personenbezogener Daten
                  (Datenschutzgesetz), kurz <strong>DSG</strong>.
                </span>
              </li>
              <li
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontSize: 15,
                  color: 'var(--text-secondary)',
                }}
              >
                <span style={{ color: 'var(--gold)', fontSize: 18 }}>•</span>
                <span>
                  In Deutschland gilt das Bundesdatenschutzgesetz, kurz{' '}
                  <strong>BDSG</strong>.
                </span>
              </li>
            </ul>
            <p className="legal-p">
              Sofern weitere regionale oder nationale Gesetze zur Anwendung
              kommen, informieren wir Sie in den folgenden Abschnitten darüber.
            </p>
          </section>

          {/* Kontaktdaten des Verantwortlichen */}
          <section style={{ marginBottom: 32 }}>
            <h2 className="legal-h2">Kontaktdaten des Verantwortlichen</h2>
            <p className="legal-p">
              Sollten Sie Fragen zum Datenschutz oder zur Verarbeitung
              personenbezogener Daten haben, finden Sie nachfolgend die
              Kontaktdaten des Verantwortlichen gemäß Artikel 4 Absatz 7
              EU-Datenschutz-Grundverordnung (DSGVO):
            </p>
            <div className="legal-card">
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 17,
                  color: 'var(--text-primary)',
                  marginBottom: 6,
                }}
              >
                Taxi Alica
              </div>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: 15,
                  lineHeight: 1.6,
                }}
              >
                Bötzinger Str. 66
                <br />
                79111 Freiburg im Breisgau-St. Georgen, Deutschland
              </div>
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  fontSize: 14.5,
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Telefon: </span>
                  <a href="tel:+4976115537668" className="legal-link">
                    0761 15 53 76 68
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Speicherdauer */}
          <section style={{ marginBottom: 32 }}>
            <h2 className="legal-h2">Speicherdauer</h2>
            <p className="legal-p">
              Dass wir personenbezogene Daten nur so lange speichern, wie es für
              die Bereitstellung unserer Dienstleistungen und Produkte unbedingt
              notwendig ist, gilt als generelles Kriterium bei uns. Das
              bedeutet, dass wir personenbezogene Daten löschen, sobald der
              Grund für die Datenverarbeitung nicht mehr vorhanden ist. In
              einigen Fällen sind wir gesetzlich dazu verpflichtet, bestimmte
              Daten auch nach Wegfall des ursprüngliches Zwecks zu speichern,
              zum Beispiel zu Zwecken der Buchführung.
            </p>
            <p className="legal-p">
              Sollten Sie die Löschung Ihrer Daten wünschen oder die
              Einwilligung zur Datenverarbeitung widerrufen, werden die Daten so
              rasch wie möglich und soweit keine Pflicht zur Speicherung
              besteht, gelöscht.
            </p>
            <p className="legal-p">
              Über die konkrete Dauer der jeweiligen Datenverarbeitung
              informieren wir Sie weiter unten, sofern wir weitere Informationen
              dazu haben.
            </p>
          </section>

          {/* Rechte laut Datenschutz-Grundverordnung */}
          <section style={{ marginBottom: 32 }}>
            <h2 className="legal-h2">
              Rechte laut Datenschutz-Grundverordnung
            </h2>
            <p className="legal-p">
              Gemäß Artikel 13, 14 DSGVO informieren wir Sie über die folgenden
              Rechte, die Ihnen zustehen, damit es zu einer fairen und
              transparenten Verarbeitung von Daten kommt:
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                margin: '18px 0 24px',
              }}
            >
              <div className="legal-card">
                <h3 className="legal-h3" style={{ margin: '0 0 10px' }}>
                  Auskunftsrecht (Artikel 15 DSGVO)
                </h3>
                <p className="legal-p" style={{ marginBottom: 12 }}>
                  Sie haben laut Artikel 15 DSGVO ein Auskunftsrecht darüber, ob
                  wir Daten von Ihnen verarbeiten. Sollte das zutreffen, haben
                  Sie Recht darauf eine Kopie der Daten zu erhalten und die
                  folgenden Informationen zu erfahren:
                </p>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  {[
                    'zu welchem Zweck wir die Verarbeitung durchführen;',
                    'die Kategorien, also die Arten von Daten, die verarbeitet werden;',
                    'wer diese Daten erhält und wenn die Daten an Drittländer übermittelt werden, wie die Sicherheit garantiert werden kann;',
                    'wie lange die Daten gespeichert werden;',
                    'das Bestehen des Rechts auf Berichtigung, Löschung oder Einschränkung der Verarbeitung und dem Widerspruchsrecht gegen die Verarbeitung;',
                    'dass Sie sich bei einer Aufsichtsbehörde beschweren können (Links zu diesen Behörden finden Sie weiter unten);',
                    'die Herkunft der Daten, wenn wir sie nicht bei Ihnen erhoben haben;',
                    'ob Profiling durchgeführt wird, ob also Daten automatisch ausgewertet werden, um zu einem persönlichen Profil von Ihnen zu gelangen.',
                  ].map((subItem) => (
                    <li
                      key={subItem}
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 10,
                        fontSize: 14.5,
                        color: 'var(--text-soft)',
                      }}
                    >
                      <span style={{ color: 'var(--gold)', fontSize: 14 }}>
                        •
                      </span>
                      <span>{subItem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="legal-card">
                <h3 className="legal-h3" style={{ margin: '0 0 8px' }}>
                  Recht auf Berichtigung (Artikel 16 DSGVO)
                </h3>
                <p className="legal-p" style={{ margin: 0 }}>
                  Sie haben laut Artikel 16 DSGVO ein Recht auf Berichtigung der
                  Daten, was bedeutet, dass wir Daten richtig stellen müssen,
                  falls Sie Fehler finden.
                </p>
              </div>

              <div className="legal-card">
                <h3 className="legal-h3" style={{ margin: '0 0 8px' }}>
                  Recht auf Löschung (Artikel 17 DSGVO)
                </h3>
                <p className="legal-p" style={{ margin: 0 }}>
                  Sie haben laut Artikel 17 DSGVO das Recht auf Löschung („Recht
                  auf Vergessenwerden“), was konkret bedeutet, dass Sie die
                  Löschung Ihrer Daten verlangen dürfen.
                </p>
              </div>

              <div className="legal-card">
                <h3 className="legal-h3" style={{ margin: '0 0 8px' }}>
                  Recht auf Einschränkung der Verarbeitung (Artikel 18 DSGVO)
                </h3>
                <p className="legal-p" style={{ margin: 0 }}>
                  Sie haben laut Artikel 18 DSGVO das Recht auf Einschränkung
                  der Verarbeitung, was bedeutet, dass wir die Daten nur mehr
                  speichern dürfen aber nicht weiter verwenden.
                </p>
              </div>

              <div className="legal-card">
                <h3 className="legal-h3" style={{ margin: '0 0 8px' }}>
                  Recht auf Datenübertragbarkeit (Artikel 20 DSGVO)
                </h3>
                <p className="legal-p" style={{ margin: 0 }}>
                  Sie haben laut Artikel 20 DSGVO das Recht auf
                  Datenübertragbarkeit, was bedeutet, dass wir Ihnen auf Anfrage
                  Ihre Daten in einem gängigen Format zur Verfügung stellen.
                </p>
              </div>

              <div className="legal-card">
                <h3 className="legal-h3" style={{ margin: '0 0 8px' }}>
                  Widerspruchsrecht (Artikel 21 DSGVO)
                </h3>
                <p className="legal-p" style={{ marginBottom: 10 }}>
                  Sie haben laut Artikel 21 DSGVO ein Widerspruchsrecht, welches
                  nach Durchsetzung eine Änderung der Verarbeitung mit sich
                  bringt:
                </p>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <li
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 10,
                      fontSize: 14.5,
                      color: 'var(--text-soft)',
                    }}
                  >
                    <span style={{ color: 'var(--gold)', fontSize: 14 }}>
                      •
                    </span>
                    <span>
                      Wenn die Verarbeitung Ihrer Daten auf Artikel 6 Abs. 1
                      lit. e (öffentliches Interesse, Ausübung öffentlicher
                      Gewalt) oder Artikel 6 Abs. 1 lit. f (berechtigtes
                      Interesse) basiert, können Sie gegen die Verarbeitung
                      Widerspruch einlegen. Wir prüfen danach so rasch wie
                      möglich, ob wir diesem Widerspruch rechtlich nachkommen
                      können.
                    </span>
                  </li>
                  <li
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 10,
                      fontSize: 14.5,
                      color: 'var(--text-soft)',
                    }}
                  >
                    <span style={{ color: 'var(--gold)', fontSize: 14 }}>
                      •
                    </span>
                    <span>
                      Werden Daten verwendet, um Direktwerbung zu betreiben,
                      können Sie jederzeit gegen diese Art der Datenverarbeitung
                      widersprechen. Wir dürfen Ihre Daten danach nicht mehr für
                      Direktmarketing verwenden.
                    </span>
                  </li>
                  <li
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 10,
                      fontSize: 14.5,
                      color: 'var(--text-soft)',
                    }}
                  >
                    <span style={{ color: 'var(--gold)', fontSize: 14 }}>
                      •
                    </span>
                    <span>
                      Werden Daten verwendet, um Profiling zu betreiben, können
                      Sie jederzeit gegen diese Art der Datenverarbeitung
                      widersprechen. Wir dürfen Ihre Daten danach nicht mehr für
                      Profiling verwenden.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="legal-card">
                <h3 className="legal-h3" style={{ margin: '0 0 8px' }}>
                  Automatisierte Entscheidungen im Einzelfall (Artikel 22 DSGVO)
                </h3>
                <p className="legal-p" style={{ margin: 0 }}>
                  Sie haben laut Artikel 22 DSGVO unter Umständen das Recht,
                  nicht einer ausschließlich auf einer automatisierten
                  Verarbeitung (zum Beispiel Profiling) beruhenden Entscheidung
                  unterworfen zu werden.
                </p>
              </div>

              <div className="legal-card">
                <h3 className="legal-h3" style={{ margin: '0 0 8px' }}>
                  Recht auf Beschwerde (Artikel 77 DSGVO)
                </h3>
                <p className="legal-p" style={{ margin: 0 }}>
                  Sie haben laut Artikel 77 DSGVO das Recht auf Beschwerde. Das
                  heißt, Sie können sich jederzeit bei der Datenschutzbehörde
                  beschweren, wenn Sie der Meinung sind, dass die
                  Datenverarbeitung von personenbezogenen Daten gegen die DSGVO
                  verstößt.
                </p>
              </div>
            </div>

            <div className="legal-callout">
              <strong style={{ color: 'var(--text-primary)' }}>
                Kurz gesagt:
              </strong>{' '}
              Sie haben Rechte – zögern Sie nicht, die oben gelistete
              verantwortliche Stelle bei uns zu kontaktieren!
            </div>

            <p className="legal-p">
              Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das
              Datenschutzrecht verstößt oder Ihre datenschutzrechtlichen
              Ansprüche in sonst einer Weise verletzt worden sind, können Sie
              sich bei der Aufsichtsbehörde beschweren. Diese ist für Österreich
              die Datenschutzbehörde, deren Website Sie unter{' '}
              <a
                href="https://www.dsb.gv.at/"
                target="_blank"
                rel="noopener noreferrer"
                className="legal-link"
              >
                https://www.dsb.gv.at/
              </a>{' '}
              finden. In Deutschland gibt es für jedes Bundesland einen
              Datenschutzbeauftragten. Für nähere Informationen können Sie sich
              an die Bundesbeauftragte für den Datenschutz und die
              Informationsfreiheit (BfDI) wenden. Für unser Unternehmen ist die
              folgende lokale Datenschutzbehörde zuständig:
            </p>

            <div className="legal-card">
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 16.5,
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                }}
              >
                Baden-Württemberg Datenschutzbehörde
              </div>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: 15,
                  lineHeight: 1.65,
                }}
              >
                <strong>Landesbeauftragter für Datenschutz:</strong> Prof. Dr.
                Tobias Keber
                <br />
                <strong>Adresse:</strong> Lautenschlagerstraße 20, 70173
                Stuttgart
                <br />
                <strong>Telefonnr.:</strong>{' '}
                <a href="tel:07116155410" className="legal-link">
                  07 11/61 55 41-0
                </a>
                <br />
                <strong>E-Mail-Adresse:</strong>{' '}
                <a href="mailto:poststelle@lfdi.bwl.de" className="legal-link">
                  poststelle@lfdi.bwl.de
                </a>
                <br />
                <strong>Website:</strong>{' '}
                <a
                  href="https://www.baden-wuerttemberg.datenschutz.de/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="legal-link"
                >
                  https://www.baden-wuerttemberg.datenschutz.de/
                </a>
              </div>
            </div>
          </section>

          {/* Urheberrecht und Quelle */}
          <footer
            style={{
              marginTop: 48,
              paddingTop: 24,
              borderTop: '1px solid var(--border)',
              fontSize: 13.5,
              color: 'var(--text-faint)',
              lineHeight: 1.6,
            }}
          >
            <p style={{ margin: '0 0 8px' }}>
              Alle Texte sind urheberrechtlich geschützt.
            </p>
            <p style={{ margin: 0 }}>
              Quelle: Datenschutzerklärung erstellt mit dem Datenschutz
              Generator für Deutschland von AdSimple. Schauen Sie sich auch
              unsere Muster-Datenschutzerklärung an.
            </p>
          </footer>
        </main>

        <Footer t={t} lang={lang} />
      </div>
    </>
  );
}
