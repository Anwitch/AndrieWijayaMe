import { describe, expect, test } from "vitest";
import {
  personExperienceSchema,
  personSchema,
  pressSchemas,
} from "./structured-data";
import { formatPressText, parsePressText } from "./press";
import { DEFAULT_SITE_SETTINGS } from "./site-settings";

describe("personSchema", () => {
  const schema = personSchema(DEFAULT_SITE_SETTINGS, [
    "https://www.linkedin.com/in/andrie-wijaya",
    "https://github.com/Anwitch",
  ]);

  test("includes entity-linking fields", () => {
    expect(schema.alternateName).toBe("Anwitch");
    expect(schema.email).toBe("mailto:andrie.wijaya.contact@gmail.com");
    expect(schema.nationality).toMatchObject({ name: "Indonesia" });
    expect(schema.alumniOf).toMatchObject({
      "@type": "EducationalOrganization",
      name: "Universitas Tanjungpura",
    });
    expect(schema.affiliation).toMatchObject({
      "@type": "Organization",
      name: "HMIF FT UNTAN",
    });
    expect(schema.hasOccupation).toMatchObject({
      "@type": "Occupation",
      name: "Product Thinker & Problem Solver",
    });
  });

  test("passes sameAs through", () => {
    expect(schema.sameAs).toEqual([
      "https://www.linkedin.com/in/andrie-wijaya",
      "https://github.com/Anwitch",
    ]);
  });

  test("omits sameAs when empty", () => {
    const bare = personSchema(DEFAULT_SITE_SETTINGS);
    expect("sameAs" in bare).toBe(false);
  });
});

describe("pressSchemas", () => {
  test("maps press items to NewsArticle nodes", () => {
    expect(
      pressSchemas([
        { publisher: "UNTAN", title: "Judul", url: "https://untan.ac.id/a" },
      ]),
    ).toEqual([
      {
        "@type": "NewsArticle",
        headline: "Judul",
        url: "https://untan.ac.id/a",
        publisher: { "@type": "Organization", name: "UNTAN" },
      },
    ]);
  });
});

describe("personExperienceSchema", () => {
  test("attaches roles to the site-wide Person", () => {
    const schema = personExperienceSchema([
      { title: "ATEROSTOP", description: "d", role: "Perangkat Lunak" },
      { title: "Magang", description: "d", organization: "Diskominfo" },
    ]);
    expect(schema["@id"]).toMatch(/#person$/);
    expect(schema.memberOf[0]).toMatchObject({
      roleName: "Perangkat Lunak",
      memberOf: { name: "ATEROSTOP" },
    });
    expect(schema.memberOf[1].memberOf.name).toBe("Diskominfo");
    expect("roleName" in schema.memberOf[1]).toBe(false);
  });
});

describe("press text format", () => {
  test("round-trips and reports incomplete lines", () => {
    const press = [
      { publisher: "UNTAN", title: "Judul", url: "https://a.id", date: "2026-09-09" },
      { publisher: "RRI", title: "Siaran", url: "https://b.id" },
    ];
    expect(parsePressText(formatPressText(press))).toEqual(press);
    expect(() => parsePressText("UNTAN | Judul")).toThrow(/line 1/);
  });
});
