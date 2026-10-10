import uuid
from backend.app.core.database import SessionLocal
from backend.app.models.question import Question, QuestionOption
from backend.app.models.taxonomy import Topic, Chapter, Subject
from backend.app.models.test import Test, TestQuestion

def seed_living_world_questions():
    db = SessionLocal()
    try:
        # Verify Chapter 101 exists
        chap = db.query(Chapter).filter(Chapter.id == 101).first()
        if not chap:
            print("Chapter 101 not found! Creating Chapter 101 Living World...")
            sub_bio = db.query(Subject).filter(Subject.slug == "biology").first()
            if not sub_bio:
                sub_bio = Subject(id=1, name="Biology", slug="biology", icon="dna", display_order=1)
                db.add(sub_bio)
                db.flush()
            chap = Chapter(id=101, subject_id=sub_bio.id, name="Living World", slug="living-world", display_order=1)
            db.add(chap)
            db.flush()

        # Verify topics
        topic_defs = [
            (1001, "What is Living?", "what-is-living", 1),
            (1002, "Diversity In The Living World", "diversity-living-world", 2),
            (1003, "Systematics", "systematics", 3),
            (1004, "Types Of Taxonomy", "types-taxonomy", 4),
            (1005, "Fundamental Components Of Taxonomy", "fundamental-taxonomy", 5),
            (1006, "Taxonomic Categories", "taxonomic-categories", 6),
            (1007, "Taxonomical Aids", "taxonomical-aids", 7),
        ]
        for tid, tname, tslug, tord in topic_defs:
            t = db.query(Topic).filter(Topic.id == tid).first()
            if not t:
                db.add(Topic(id=tid, chapter_id=101, name=tname, slug=tslug, display_order=tord))
        db.flush()

        questions_list = [
            {
                "id": "q-living-world-pyq-01",
                "topic_id": 1005,
                "text": "Nomenclature is governed by certain universal rules. Which one of the following is contrary to the rules of nomenclature?\n\n[NEET-I 2016 • DL02-0019]",
                "difficulty": "MEDIUM",
                "source": "NEET-I 2016 (DL02-0019)",
                "year": 2016,
                "explanation": "**Biological names are generally in Latin and written in italics.** They are Latinised or derived from Latin irrespective of their origin. They cannot be written in any arbitrary language.\n\n• The first word in a biological name represents the genus name, and the second component denotes the specific epithet.\n• Both the words in a biological name, when handwritten, are separately underlined, or printed in italics to indicate their Latin origin.\n• Hence, statement (1) is contrary to the universal rules of binomial nomenclature.",
                "options": [
                    ("A", "Biological names can be written in any language", True),
                    ("B", "The first word in a biological name represents the genus name, and the second is a specific epithet", False),
                    ("C", "The names are written in Latin and are italicised", False),
                    ("D", "When written by hand, the names are to be underlined", False)
                ]
            },
            {
                "id": "q-living-world-pyq-02",
                "topic_id": 1007,
                "text": "The label of a herbarium sheet does not carry information on :\n\n[NEET-II 2016 • DL09-0001]",
                "difficulty": "EASY",
                "source": "NEET-II 2016 (DL09-0001)",
                "year": 2016,
                "explanation": "A **herbarium sheet** carries a label at the lower right-hand corner providing information about:\n1. Date and place of collection\n2. English, local and botanical names\n3. Family\n4. Collector's name\n\nIt does **NOT** carry information regarding the **height of the plant**.",
                "options": [
                    ("A", "Local names", False),
                    ("B", "height of the plant", True),
                    ("C", "date of collection", False),
                    ("D", "name of collector", False)
                ]
            },
            {
                "id": "q-living-world-pyq-03",
                "topic_id": 1006,
                "text": "Match Column-I with Column-II for housefly classification and select the correct option using the codes given below :\n\n| Column-I | Column-II |\n| :--- | :--- |\n| (a) Family | (i) Diptera |\n| (b) Order | (ii) Arthropoda |\n| (c) Class | (iii) Muscidae |\n| (d) Phylum | (iv) Insecta |\n\n[PYQ • DL13-0006]",
                "difficulty": "MEDIUM",
                "source": "NEET PYQ (DL13-0006)",
                "year": 2016,
                "explanation": "Taxonomic classification of Housefly (*Musca domestica*):\n• **Family**: Muscidae $\\rightarrow$ (iii)\n• **Order**: Diptera $\\rightarrow$ (i)\n• **Class**: Insecta $\\rightarrow$ (iv)\n• **Phylum**: Arthropoda $\\rightarrow$ (ii)\n\nTherefore, the correct code matching is **(a)-(iii), (b)-(i), (c)-(iv), (d)-(ii)** corresponding to option (3).",
                "options": [
                    ("A", "(a)-(iv), (b)-(iii), (c)-(ii), (d)-(i)", False),
                    ("B", "(a)-(iv), (b)-(ii), (c)-(i), (d)-(iii)", False),
                    ("C", "(a)-(iii), (b)-(i), (c)-(iv), (d)-(ii)", True),
                    ("D", "(a)-(iii), (b)-(ii), (c)-(iv), (d)-(i)", False)
                ]
            },
            {
                "id": "q-living-world-pyq-04",
                "topic_id": 1001,
                "text": "Study the four statements (A–D) given below and select the two correct ones out of them :\n(A) Definition of biological species was given by Ernst Mayr.\n(B) Photoperiod does not affect reproduction in plants.\n(C) Binomial nomenclature system was given by R.H. Whittaker.\n(D) In unicellular organisms, reproduction is synonymous with growth.\n\nThe two correct statements are :\n\n[DL01-0018]",
                "difficulty": "MEDIUM",
                "source": "NEET PYQ (DL01-0018)",
                "year": 2016,
                "explanation": "• **Statement (A) is correct**: Ernst Mayr ('Darwin of the 20th century') formulated the biological species concept.\n• **Statement (B) is incorrect**: Photoperiod affects reproduction in seasonal breeders, both plants and animals.\n• **Statement (C) is incorrect**: Binomial nomenclature was proposed by Carolus Linnaeus (Whittaker proposed Five Kingdom classification).\n• **Statement (D) is correct**: In unicellular organisms (bacteria, amoeba), reproduction is synonymous with growth (increase in number of cells).\n\nHence, statements **A and D** are correct.",
                "options": [
                    ("A", "A and D", True),
                    ("B", "A and B", False),
                    ("C", "B and C", False),
                    ("D", "C and D", False)
                ]
            },
            {
                "id": "q-living-world-pyq-05",
                "topic_id": 1007,
                "text": "Match the items given in Column-I with those in Column-II and select the correct option given below :-\n\n| Column-I | Column-II |\n| :--- | :--- |\n| (a) Herbarium | (i) It is a place having a collection of preserved plants and animals. |\n| (b) Key | (ii) A list that enumerates methodically all the species found in an area with brief description aiding identification. |\n| (c) Museum | (iii) Is a place where dried and pressed plant specimens mounted on sheets are kept. |\n| (d) Catalogue | (iv) A booklet containing a list of characters and their alternates which are helpful in identification of various taxa. |\n\n[NEET-UG 2018 • DL13-0003]",
                "difficulty": "MEDIUM",
                "source": "NEET-UG 2018 (DL13-0003)",
                "year": 2018,
                "explanation": "• **Herbarium**: A place where dried and pressed plant specimens mounted on sheets are kept $\\rightarrow$ (iii)\n• **Key**: A booklet containing a list of characters and their alternates which are helpful in identification of various taxa $\\rightarrow$ (iv)\n• **Museum**: A place having a collection of preserved plants and animals $\\rightarrow$ (i)\n• **Catalogue**: A list that enumerates methodically all the species found in an area with brief description aiding identification $\\rightarrow$ (ii)\n\nCorrect matching is **(a)-iii, (b)-iv, (c)-i, (d)-ii**.",
                "options": [
                    ("A", "(a)-i, (b)-iv, (c)-iii, (d)-ii", False),
                    ("B", "(a)-iii, (b)-ii, (c)-i, (d)-iv", False),
                    ("C", "(a)-ii, (b)-iv, (c)-iii, (d)-i", False),
                    ("D", "(a)-iii, (b)-iv, (c)-i, (d)-ii", True)
                ]
            },
            {
                "id": "q-living-world-pyq-06",
                "topic_id": 1005,
                "text": "Select correctly written scientific name of Mango which was first described by Carolus Linnaeus :\n\n[NEET-UG 2019 • DL02-0014]",
                "difficulty": "EASY",
                "source": "NEET-UG 2019 (DL02-0014)",
                "year": 2019,
                "explanation": "According to the universal rules of Binomial Nomenclature, the name of the author appears after the specific epithet (at the end of the biological name) and is written in an abbreviated form without italics, e.g., ***Mangifera indica* Linn.** This indicates that the species was first described by Linnaeus.",
                "options": [
                    ("A", "Mangifera indica Car. Linn.", False),
                    ("B", "Mangifera indica Linn.", True),
                    ("C", "Mangifera indica", False),
                    ("D", "Mangifera Indica", False)
                ]
            },
            {
                "id": "q-living-world-pyq-07",
                "topic_id": 1005,
                "text": "Which of the following is against the rules of ICBN?\n\n[NEET-UG 2019 (Odisha) • DL02-0015]",
                "difficulty": "EASY",
                "source": "NEET-UG 2019 (Odisha) (DL02-0015)",
                "year": 2019,
                "explanation": "According to the International Code of Botanical Nomenclature (ICBN):\n• The **genus name always starts with a capital letter** (e.g., *Mangifera*).\n• The **specific epithet always starts with a small letter** (e.g., *indica*).\n• Writing both generic and specific names starting with small letters is strictly against the rules.",
                "options": [
                    ("A", "Hand written scientific names should be underlined.", False),
                    ("B", "Every species should have a generic name and a specific epithet.", False),
                    ("C", "Scientific names are in Latin and should be italicized.", False),
                    ("D", "Generic and specific names should be written starting with small letters.", True)
                ]
            },
            {
                "id": "q-living-world-pyq-08",
                "topic_id": 1007,
                "text": "The contrasting characteristics generally in a pair used for identification of animals in taxonomic key are referred to as :\n\n[PYQ • DL11-0001]",
                "difficulty": "EASY",
                "source": "NEET PYQ (DL11-0001)",
                "year": 2020,
                "explanation": "**Key** is a taxonomical aid used for identification based on similarities and dissimilarities. The keys are based on the contrasting characters generally in a pair called a **couplet**. It represents the choice made between two opposite options. Each statement in the key is called a **lead**.",
                "options": [
                    ("A", "Lead", False),
                    ("B", "Couplet", True),
                    ("C", "Doublet", False),
                    ("D", "Alternate", False)
                ]
            },
            {
                "id": "q-living-world-pyq-09",
                "topic_id": 1006,
                "text": "Which one of the following belongs to the family Muscidae?\n\n[NEET-UG 2021 • DL13-0004]",
                "difficulty": "EASY",
                "source": "NEET-UG 2021 (DL13-0004)",
                "year": 2021,
                "explanation": "**Housefly (*Musca domestica*)** belongs to:\n• Kingdom: Animalia\n• Phylum: Arthropoda\n• Class: Insecta\n• Order: Diptera\n• **Family: Muscidae**\n• Genus: *Musca*\n• Species: *domestica*",
                "options": [
                    ("A", "Fire fly", False),
                    ("B", "Grasshopper", False),
                    ("C", "Cockroach", False),
                    ("D", "House fly", True)
                ]
            },
            {
                "id": "q-living-world-pyq-10",
                "topic_id": 1006,
                "text": "In the taxonomic categories which hierarchical arrangement in ascending order is correct in case of animals ?\n\n[NEET-UG 2022 • DL04-0016]",
                "difficulty": "MEDIUM",
                "source": "NEET-UG 2022 (DL04-0016)",
                "year": 2022,
                "explanation": "In the official NEET 2022 answer key, NTA accepted **Kingdom $\\rightarrow$ Phylum $\\rightarrow$ Class $\\rightarrow$ Order $\\rightarrow$ Family $\\rightarrow$ Genus $\\rightarrow$ Species** (Option 4). Note that for animals, 'Phylum' is used instead of 'Division'.",
                "options": [
                    ("A", "Kingdom, Class, Phylum, Family, Order, Genus, Species", False),
                    ("B", "Kingdom, Order, Class, Phylum, Family, Genus, Species", False),
                    ("C", "Kingdom, Order, Phylum, Class, Family, Genus, Species", False),
                    ("D", "Kingdom, Phylum, Class, Order, Family, Genus, Species", True)
                ]
            },
            {
                "id": "q-living-world-pyq-11",
                "topic_id": 1007,
                "text": "Which of the following are true about the taxonomical aid 'key' ?\n(a) Keys are based on the similarities and dissimilarities.\n(b) Key is analytical in nature.\n(c) Keys are based on the contrasting characters in pair called couplet.\n(d) Same key can be used for all taxonomic categories.\n(e) Each statement in the key is called Lead.\n\nChoose the most appropriate answer from the options given below :\n\n[Re-NEET-UG 2022 • DL11-0002]",
                "difficulty": "MEDIUM",
                "source": "Re-NEET-UG 2022 (DL11-0002)",
                "year": 2022,
                "explanation": "• **Statement (a) is true**: Keys are based on similarities and dissimilarities.\n• **Statement (b) is true**: Keys are analytical in nature.\n• **Statement (c) is true**: Keys are based on contrasting characters in a pair called couplet.\n• **Statement (d) is incorrect**: Separate taxonomic keys are required for each taxonomic category such as family, genus and species for identification purposes.\n• **Statement (e) is true**: Each statement in the key is called a Lead.\n\nHence, **(a), (b), (c) and (e) only** are true.",
                "options": [
                    ("A", "(a), (b) and (c) only", False),
                    ("B", "(b), (c) and (d) only", False),
                    ("C", "(a), (b), (c) and (e) only", True),
                    ("D", "(a), (c), (d) and (e) only", False)
                ]
            },
            {
                "id": "q-living-world-pyq-12",
                "topic_id": 1005,
                "text": "'X' and 'Y' are the components of Binomial nomenclature. This naming system was proposed by 'Z' :\n\n[NEET (UG) 2023 (Manipur) • DL02-0020]",
                "difficulty": "EASY",
                "source": "NEET (UG) 2023 (Manipur) (DL02-0020)",
                "year": 2023,
                "explanation": "Binomial nomenclature has two components: **X - Generic name** and **Y - Specific epithet**. This universally accepted naming system was proposed by **Z - Carolus Linnaeus**.\n• Example: *Mangifera indica* Linn. (Generic name: *Mangifera*, Specific epithet: *indica*).",
                "options": [
                    ("A", "X-Generic name, Y-Specific epithet, Z-Carolus Linnaeus", True),
                    ("B", "X-Specific epithet, Y-Generic name, Z-R.H. Whittaker", False),
                    ("C", "X-Specific epithet, Y-Generic name, Z-Carolus Linnaeus", False),
                    ("D", "X-Generic name, Y-Specific epithet, Z-R.H. Whittaker", False)
                ]
            }
        ]

        added_or_updated = 0
        for q_data in questions_list:
            existing_q = db.query(Question).filter(Question.id == q_data["id"]).first()
            if existing_q:
                existing_q.topic_id = q_data["topic_id"]
                existing_q.question_text = q_data["text"]
                existing_q.difficulty = q_data["difficulty"]
                existing_q.explanation = q_data["explanation"]
                existing_q.source = q_data["source"]
                existing_q.year = q_data["year"]
                existing_q.is_active = True
                db.query(QuestionOption).filter(QuestionOption.question_id == existing_q.id).delete()
                for key, text, is_corr in q_data["options"]:
                    db.add(QuestionOption(
                        id=str(uuid.uuid4()),
                        question_id=existing_q.id,
                        option_key=key,
                        option_text=text,
                        is_correct=is_corr
                    ))
            else:
                q = Question(
                    id=q_data["id"],
                    topic_id=q_data["topic_id"],
                    question_text=q_data["text"],
                    question_type="SINGLE_CHOICE",
                    difficulty=q_data["difficulty"],
                    explanation=q_data["explanation"],
                    source=q_data["source"],
                    year=q_data["year"],
                    is_active=True
                )
                db.add(q)
                for key, text, is_corr in q_data["options"]:
                    db.add(QuestionOption(
                        id=str(uuid.uuid4()),
                        question_id=q.id,
                        option_key=key,
                        option_text=text,
                        is_correct=is_corr
                    ))
            added_or_updated += 1

        db.flush()

        # Update test-bio-diversity test questions
        test_bio = db.query(Test).filter(Test.id == "test-bio-diversity").first()
        if test_bio:
            # Delete previous test questions and link all 12 living world pyqs + original ones
            db.query(TestQuestion).filter(TestQuestion.test_id == test_bio.id).delete()
            all_bio_qids = [q["id"] for q in questions_list]
            test_bio.total_marks = len(all_bio_qids) * 4
            test_bio.duration_minutes = 20
            for idx, qid in enumerate(all_bio_qids, 1):
                db.add(TestQuestion(
                    id=str(uuid.uuid4()),
                    test_id=test_bio.id,
                    question_id=qid,
                    section_name="Section A",
                    order_index=idx
                ))

        db.commit()
        print(f"Successfully added/updated {added_or_updated} Living World PYQ questions!")

    except Exception as e:
        db.rollback()
        print("Error seeding questions:", e)
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_living_world_questions()
