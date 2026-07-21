import { describe, expect, test } from "vitest";
import { personSchema } from "./structured-data";
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
