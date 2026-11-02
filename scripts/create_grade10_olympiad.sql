BEGIN;
-- 1. Update categories and tags in question_bank for Grade 10

UPDATE public.question_bank
SET category = 'Azərbaycan dili',
    tags = ARRAY['10-cu sinif', 'Azərbaycan dili']
WHERE id IN ('0b36bc0a-918d-4753-a291-b5752c65207c'::uuid, '0dadb0c2-3ad9-455e-8d61-1e1181f1bb7c'::uuid, '1952ac23-3f9d-4f82-aea8-841d804fb23b'::uuid, '247b650f-800b-410a-a03c-6eafb7fafcc8'::uuid, '361fbb74-5a7e-4887-97a8-7e17856f2add'::uuid, '3756855a-4001-402e-9895-d18cfa8256f4'::uuid, '3b3b4976-3431-4cfb-baa9-921458150b69'::uuid, '3de590b8-2381-4e5d-80ab-5002ef4e2895'::uuid, '4305e418-e9cd-488d-ab7f-156505fcf6ac'::uuid, '5b0bb821-df26-4169-a86a-acdf051ba061'::uuid, '65480164-9bd0-41e1-aca4-59f70c4851fe'::uuid, '8195f6c1-4825-493c-b5e0-38596ddf25cc'::uuid, '9323017d-ad04-42bb-8f06-c39eed83559c'::uuid, '93b613dd-9cbb-4c63-97f9-f7b8108a373b'::uuid, '9ac2687f-e27b-4bd5-8170-d4220404fc6a'::uuid, 'ba4a45be-851a-45ba-8d5d-7a443de4b48d'::uuid, 'c6d35c53-6c52-4dff-8ada-d68f63ce70ed'::uuid, 'c7b5d386-94db-4c58-a052-28c06b827365'::uuid, 'd4459c3f-3b1a-4582-befd-333e6518e240'::uuid, 'ee61176d-5fd5-4411-9aa6-37d8519a0f12'::uuid);


UPDATE public.question_bank
SET category = 'Ədəbiyyat',
    tags = ARRAY['10-cu sinif', 'Ədəbiyyat']
WHERE id IN ('10cec9cb-e3be-431f-a1f3-c02dda26270d'::uuid, '2f8c2a29-dcf5-4b9a-a97f-911b8134d41a'::uuid, '42144490-b407-4d87-a91b-a99920cb80b6'::uuid, '72b54e45-428e-49b6-9dd8-eef9e3961929'::uuid, 'ab644a94-a004-4ac9-9e8f-d8bea48c4e7a'::uuid, 'b22dc748-bfb9-4e34-9517-1b5df7be3efe'::uuid, 'b40314c3-0825-48ab-9fce-1ededcb790c4'::uuid, 'dd365481-2a70-45d4-9431-5f43860326af'::uuid, 'ddda4c4b-4f80-4fa7-a27e-5009083ab3f9'::uuid, 'e72790c1-01df-43c7-92fd-17109d20dc19'::uuid, '01c2e0ce-a930-48c8-99c3-35ce06ebcb5b'::uuid, '0e7b38b1-aa96-49f4-8000-4d937f184d71'::uuid, '201325a9-d4a7-4e81-acc0-607cab81ae69'::uuid, '42237aab-221f-42df-aee9-bfaf7143fbf8'::uuid, '45cabc0f-549b-4a3c-8107-a3e1e9a23a09'::uuid, '67a3fd1c-ac71-43a5-9859-7076c3bb6f86'::uuid, 'a64ff9d3-5791-4b8b-b6be-77fb6ff19c7f'::uuid, 'aeae6786-cff7-4547-bf7e-51978fb72ea7'::uuid, 'bb412add-043a-415c-876c-b0f66c7b8962'::uuid, 'ec5946ef-a017-4b5a-9f73-010043498986'::uuid);


UPDATE public.question_bank
SET category = 'Riyaziyyat',
    tags = ARRAY['10-cu sinif', 'Riyaziyyat']
WHERE id IN ('2359e832-e5f4-4706-8061-30d1eff29800'::uuid, '416f8d14-3354-4788-9331-3a234189bc0d'::uuid, '6485de89-209f-4ba0-9b05-7dd312f0c8fd'::uuid, 'bc53b2a4-170c-401c-b4e2-af9f2168909b'::uuid, 'da2cf667-6e01-42bf-ad8d-358d649bc3a9'::uuid, '0543bcf7-e2be-4623-91d7-8faef1630f75'::uuid, '09f07d9e-5c84-4b31-9e5c-bdde5324fb13'::uuid, '0a38ee17-5b1f-44ef-a1bb-a5b0d5f193fa'::uuid, '180c3d8b-958e-443e-a82a-866c42101746'::uuid, '1c2e2151-5025-4a52-b3d6-0ac3905d7ed0'::uuid, '36e8ff7c-f117-4ae3-bf3d-a3f8633e2630'::uuid, '422d1433-f18c-415f-a678-5ed1c285f15a'::uuid, '5527f1ea-3a67-4320-9c48-32bac1d66897'::uuid, '6cc52470-23e9-4ef9-910c-ba35df93b14f'::uuid, '806bc61d-7b81-43e6-91ef-a9164f40ded3'::uuid, '81b2b0c0-0dcc-4727-92bb-153a2f80f6de'::uuid, 'a9738e67-687f-41d2-89ca-ae217665910b'::uuid, 'a9e5fe9e-10e7-4dc3-8f8b-be781b23a97f'::uuid, 'f45ea44e-4b0d-430d-a375-1e197a71a76e'::uuid, 'fadb0912-82f5-4099-ab17-2b951fa556c3'::uuid);


UPDATE public.question_bank
SET category = 'Fizika',
    tags = ARRAY['10-cu sinif', 'Fizika']
WHERE id IN ('2aaa9201-572f-45e6-a698-f7f028260b6c'::uuid, '3e217b7e-92f1-4abc-8a58-8e7f13cb3544'::uuid, '45391962-4976-41c7-8e69-02659fc6b14d'::uuid, '613cea7a-a5f5-4e9c-8e8f-a3d36cd4ce97'::uuid, '73de34f7-449c-4c7f-bd5d-741fc523de17'::uuid, '77139fab-ef82-4e8b-a304-eeb07ab304e0'::uuid, '7dfe2c85-1add-4409-8141-475c2c4101e9'::uuid, 'd05c5dd6-c237-4565-a16b-8cd66897692d'::uuid, 'e5693d3e-acbf-4657-9d2f-29f9cce3edb7'::uuid, 'f4c7103b-215b-4ce2-8869-e17eb3cb294b'::uuid, '01577712-ccde-4608-8efb-3eb47c53b493'::uuid, '0e26b38b-a318-4118-9ca1-4109e04c40ba'::uuid, '1388b8d1-954c-4ac5-bfcd-94d1f8b27c1b'::uuid, '2a2e17fa-d6d3-4034-876e-23523b96f728'::uuid, '3c13ce8a-cdb6-45a4-aec9-18ed370b5241'::uuid, '3f343fa6-deea-4b47-99d8-42bf44edfcb9'::uuid, 'a5a202d1-0b52-447f-8a59-4b48dbcbcfd0'::uuid, 'adb97065-368b-4cde-b467-117f497b0d33'::uuid, 'bac59286-dfa7-4294-8b20-fbee19f2c9a2'::uuid, 'f7faf3e1-bd2a-41c9-9eed-a915a1b7445d'::uuid);


UPDATE public.question_bank
SET category = 'Kimya',
    tags = ARRAY['10-cu sinif', 'Kimya']
WHERE id IN ('03258de3-1e77-43e4-9ca0-526bf3161572'::uuid, '23b4f91f-53e9-4ab0-a64a-4c343d71f72c'::uuid, '3c203cdc-4ccb-48c0-9366-de23334e6f06'::uuid, '4f1f2259-2d29-491d-8043-47095d0efa16'::uuid, '68ed91cf-16b6-4469-8a92-850f12d341ea'::uuid, '8b008880-4cca-4bf1-921c-82420398fe9b'::uuid, '91062a34-e270-4921-86d7-52afb04d6e74'::uuid, 'a806ccf0-2ac9-436f-96de-5a440da763b6'::uuid, 'b2ece4cb-3c3b-4491-a053-60b7ac68fbc4'::uuid, 'bde4fdba-309b-42b5-a64b-a118fa05ba2c'::uuid, 'be00945f-a464-438e-9dfe-c2bb6887aacb'::uuid, 'd18997a0-2677-49ec-b4a1-5599ad29ff28'::uuid, 'db9b8ac0-2bf1-48e4-b968-0205a26dc927'::uuid, 'e0836d61-0a49-43d6-aede-54e68ba7e6c5'::uuid, 'e6647d74-956b-4672-ace5-f4e8e8d09af8'::uuid, '49db90b4-ae13-47c4-baae-f6a4f768d230'::uuid, '7e13ba33-2463-4960-abb0-c83d55a450d9'::uuid, '8c259601-815e-4e9e-a4fb-ba9143e6fc41'::uuid, 'bd13cec1-cc36-4b93-9513-36ea13c5329d'::uuid, 'f7512699-b99d-4a11-8cc6-5e073d9a5b33'::uuid);


UPDATE public.question_bank
SET category = 'Biologiya',
    tags = ARRAY['10-cu sinif', 'Biologiya']
WHERE id IN ('09a32138-4072-4591-8081-7c5a1b6159b1'::uuid, '1501c960-1e8e-4ae3-aad4-0e255ef14685'::uuid, '1be2b766-163e-478a-94eb-cff281413658'::uuid, '3497f3cb-64ee-413f-84ba-92f603573e29'::uuid, '3a4c1ffc-6f2c-4ead-839f-9f0d6906f944'::uuid, '3d78f679-b872-4185-8979-c11e4879b734'::uuid, '6c07deae-6e2f-4d2c-9586-277260a1c62b'::uuid, '7256e249-1796-41cd-a35a-9d06f2c02b3b'::uuid, '7423adf7-18de-463d-8bea-492c4f09c05c'::uuid, '787ed45c-a805-4481-84be-3710fd1a5064'::uuid, '7cc9b96c-296f-45da-bdda-83dcfe49ed93'::uuid, '82e373aa-3e55-45c1-946e-b9cf78b0e90f'::uuid, '89bf036d-b870-4776-8d70-f63ec9a6d6af'::uuid, 'b171cecb-7d66-4b37-acc8-5b60e655fedc'::uuid, 'b2f11369-3a26-4e2a-8c8d-411477445056'::uuid, 'b6a48222-7f7d-4b62-adac-94540db9977e'::uuid, 'b8d65e0f-5faa-4966-a0be-4b8ee6ac31ec'::uuid, 'c1b5103b-f8de-46b1-9fe9-e37fe2a5934c'::uuid, 'c9ba1660-2e0d-468f-b001-5146ea08329e'::uuid, 'd6f34c39-b7cc-4070-bb89-a51bf9bd9c25'::uuid);


UPDATE public.question_bank
SET category = 'Tarix',
    tags = ARRAY['10-cu sinif', 'Tarix']
WHERE id IN ('1913aafb-0a5d-41ef-8249-d77c620731a1'::uuid, '6bc1804c-077d-4c38-a6d3-d7f08565ab0b'::uuid, 'bf1fb03d-4138-49ae-8a74-1a2a5cda1da3'::uuid, 'c0f45cc8-6316-4961-8e37-9d396da294f2'::uuid, 'd43cd113-c5ee-48a5-adca-9d127db992a1'::uuid, '0903ca78-5a3a-4064-9641-170b3cc8f164'::uuid, '0f2c019d-6dd9-4388-beee-bd3781b7ef1e'::uuid, '16251738-6f32-42ab-a3ea-3d36b8bb22d5'::uuid, '25503c13-6094-482c-ac3a-8568b94b4906'::uuid, '43e9aef2-ad20-41cc-8f96-7e1a46b7fbde'::uuid, '4af859bc-4b59-4453-aeb8-4338f092932e'::uuid, '73213ab9-5441-408e-86cb-a0919f4618e7'::uuid, '809887f0-4bce-4014-9c29-499374f1453d'::uuid, '83620c8d-030b-47a2-930f-dc84e4581540'::uuid, '896a08aa-79a3-45be-a5f0-a1ef55e6849e'::uuid, '92358dc5-af31-430f-be36-82386e957dce'::uuid, '9e29f8a7-2401-4345-8167-c43be1d85daf'::uuid, 'ab4e5fba-d8c7-460b-a615-982d7b181f7e'::uuid, 'e382a4be-2c1a-44e1-a526-321cb94eef92'::uuid, 'e5577abc-0e0b-41c5-9a50-ae30f13c74b1'::uuid);


UPDATE public.question_bank
SET category = 'Coğrafiya',
    tags = ARRAY['10-cu sinif', 'Coğrafiya']
WHERE id IN ('038b486f-2b21-43d2-b895-588da757b45b'::uuid, '0ad163a6-9357-44a9-9754-166bad9e8875'::uuid, '10baa093-36d9-45e6-992b-33b2256f1ed4'::uuid, '1589932c-24b9-443e-9622-b7541a703f98'::uuid, '1bcb0b56-7ba4-4015-9f9e-1afa76fac124'::uuid, '1f0c20c9-d381-44e4-a5da-9a59a96d0d3a'::uuid, '4807bb3b-ef0f-49c4-9a3d-c0088d4b2d6a'::uuid, '4a479d63-4870-4bbe-a2c6-61823aee0bf5'::uuid, '565f3ae5-8a14-4bbb-8332-e28aedf7a9b4'::uuid, '7b88bd8a-4d35-455d-8365-b536b80759ce'::uuid, '9a40ca54-e764-4b0d-9757-60b616335a63'::uuid, 'b160abad-6c8d-459e-9f8a-032031cd293a'::uuid, 'c0209096-4d8b-487a-be08-0247d6f4ea4f'::uuid, 'c8307e9a-187e-4b81-9763-1af7ddc77b6f'::uuid, 'cda8debe-4136-48fa-8631-f4320bdffcbe'::uuid, 'd267cd55-c1c2-4591-ab0e-85b08d7b2a5b'::uuid, 'e655717e-302b-4dd2-98b7-5d0e54c7b9ca'::uuid, 'ef87a0eb-e385-45f4-adfa-576f73d3f5c1'::uuid, 'f98b839f-7379-4c3c-928c-d35c5b629e00'::uuid, 'faad3b61-dda2-422f-b198-0f13f1c3ddc7'::uuid);

-- 2. Create 8 Quizzes and insert questions

-- ========================================================
-- Quiz: Respublika Fənn Olimpiadası (X sinif) — Azərbaycan dili (20 sual)
-- ========================================================
WITH new_quiz AS (
    INSERT INTO public.quizzes (
        creator_id,
        title,
        description,
        subject,
        grade,
        difficulty,
        duration,
        is_public,
        is_published,
        pass_percentage,
        access_password,
        exam_category,
        allow_backtracking,
        show_question_nav,
        questions_per_page,
        feedback_timing,
        show_feedback,
        shuffle_questions
    ) VALUES (
        '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
        'Respublika Fənn Olimpiadası (X sinif) — Azərbaycan dili',
        '10-cu sinif şagirdləri üçün Azərbaycan dili fənni üzrə olimpiada sınaq imtahanı (20 sual).',
        'Azərbaycan dili',
        '10',
        'medium',
        40,
        true,
        true,
        60,
        'parol',
        'Olimpiada',
        true,
        true,
        1,
        'end_of_quiz',
        true,
        false
    )
    RETURNING id
),
ranked_bank AS (
    SELECT 
        qb.id AS bank_id,
        qb.question_text,
        qb.question_type,
        qb.options,
        qb.correct_answer,
        qb.explanation,
        qb.title AS q_title,
        qb.weight,
        qb.hint,
        qb.time_limit,
        qb.per_option_explanations,
        qb.video_url,
        qb.model_3d_url,
        qb.hotspot_data,
        qb.matching_pairs,
        qb.sequence_items,
        qb.fill_blank_template,
        qb.numerical_answer,
        qb.numerical_tolerance,
        qb.question_image_url,
        qb.option_images,
        qb.media_type,
        qb.media_url,
        qb.category AS topic,
        ROW_NUMBER() OVER (ORDER BY qb.created_at ASC, qb.id ASC) AS row_num
    FROM public.question_bank qb
    WHERE qb.id IN ('0b36bc0a-918d-4753-a291-b5752c65207c'::uuid, '0dadb0c2-3ad9-455e-8d61-1e1181f1bb7c'::uuid, '1952ac23-3f9d-4f82-aea8-841d804fb23b'::uuid, '247b650f-800b-410a-a03c-6eafb7fafcc8'::uuid, '361fbb74-5a7e-4887-97a8-7e17856f2add'::uuid, '3756855a-4001-402e-9895-d18cfa8256f4'::uuid, '3b3b4976-3431-4cfb-baa9-921458150b69'::uuid, '3de590b8-2381-4e5d-80ab-5002ef4e2895'::uuid, '4305e418-e9cd-488d-ab7f-156505fcf6ac'::uuid, '5b0bb821-df26-4169-a86a-acdf051ba061'::uuid, '65480164-9bd0-41e1-aca4-59f70c4851fe'::uuid, '8195f6c1-4825-493c-b5e0-38596ddf25cc'::uuid, '9323017d-ad04-42bb-8f06-c39eed83559c'::uuid, '93b613dd-9cbb-4c63-97f9-f7b8108a373b'::uuid, '9ac2687f-e27b-4bd5-8170-d4220404fc6a'::uuid, 'ba4a45be-851a-45ba-8d5d-7a443de4b48d'::uuid, 'c6d35c53-6c52-4dff-8ada-d68f63ce70ed'::uuid, 'c7b5d386-94db-4c58-a052-28c06b827365'::uuid, 'd4459c3f-3b1a-4582-befd-333e6518e240'::uuid, 'ee61176d-5fd5-4411-9aa6-37d8519a0f12'::uuid)
)
INSERT INTO public.questions (
    quiz_id,
    bank_question_id,
    order_index,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    title,
    weight,
    hint,
    time_limit,
    per_option_explanations,
    video_url,
    model_3d_url,
    hotspot_data,
    matching_pairs,
    sequence_items,
    fill_blank_template,
    numerical_answer,
    numerical_tolerance,
    question_image_url,
    option_images,
    media_type,
    media_url,
    topic
)
SELECT 
    new_quiz.id,
    rb.bank_id,
    rb.row_num,
    rb.question_text,
    COALESCE(rb.question_type, 'multiple_choice'),
    rb.options,
    rb.correct_answer,
    rb.explanation,
    rb.q_title,
    COALESCE(rb.weight, 1.0),
    rb.hint,
    rb.time_limit,
    rb.per_option_explanations,
    rb.video_url,
    rb.model_3d_url,
    rb.hotspot_data,
    rb.matching_pairs,
    rb.sequence_items,
    rb.fill_blank_template,
    rb.numerical_answer,
    rb.numerical_tolerance,
    rb.question_image_url,
    rb.option_images,
    rb.media_type,
    rb.media_url,
    rb.topic
FROM ranked_bank rb
CROSS JOIN new_quiz;


-- ========================================================
-- Quiz: Respublika Fənn Olimpiadası (X sinif) — Ədəbiyyat (20 sual)
-- ========================================================
WITH new_quiz AS (
    INSERT INTO public.quizzes (
        creator_id,
        title,
        description,
        subject,
        grade,
        difficulty,
        duration,
        is_public,
        is_published,
        pass_percentage,
        access_password,
        exam_category,
        allow_backtracking,
        show_question_nav,
        questions_per_page,
        feedback_timing,
        show_feedback,
        shuffle_questions
    ) VALUES (
        '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
        'Respublika Fənn Olimpiadası (X sinif) — Ədəbiyyat',
        '10-cu sinif şagirdləri üçün Ədəbiyyat fənni üzrə olimpiada sınaq imtahanı (20 sual).',
        'Ədəbiyyat',
        '10',
        'medium',
        40,
        true,
        true,
        60,
        'parol',
        'Olimpiada',
        true,
        true,
        1,
        'end_of_quiz',
        true,
        false
    )
    RETURNING id
),
ranked_bank AS (
    SELECT 
        qb.id AS bank_id,
        qb.question_text,
        qb.question_type,
        qb.options,
        qb.correct_answer,
        qb.explanation,
        qb.title AS q_title,
        qb.weight,
        qb.hint,
        qb.time_limit,
        qb.per_option_explanations,
        qb.video_url,
        qb.model_3d_url,
        qb.hotspot_data,
        qb.matching_pairs,
        qb.sequence_items,
        qb.fill_blank_template,
        qb.numerical_answer,
        qb.numerical_tolerance,
        qb.question_image_url,
        qb.option_images,
        qb.media_type,
        qb.media_url,
        qb.category AS topic,
        ROW_NUMBER() OVER (ORDER BY qb.created_at ASC, qb.id ASC) AS row_num
    FROM public.question_bank qb
    WHERE qb.id IN ('10cec9cb-e3be-431f-a1f3-c02dda26270d'::uuid, '2f8c2a29-dcf5-4b9a-a97f-911b8134d41a'::uuid, '42144490-b407-4d87-a91b-a99920cb80b6'::uuid, '72b54e45-428e-49b6-9dd8-eef9e3961929'::uuid, 'ab644a94-a004-4ac9-9e8f-d8bea48c4e7a'::uuid, 'b22dc748-bfb9-4e34-9517-1b5df7be3efe'::uuid, 'b40314c3-0825-48ab-9fce-1ededcb790c4'::uuid, 'dd365481-2a70-45d4-9431-5f43860326af'::uuid, 'ddda4c4b-4f80-4fa7-a27e-5009083ab3f9'::uuid, 'e72790c1-01df-43c7-92fd-17109d20dc19'::uuid, '01c2e0ce-a930-48c8-99c3-35ce06ebcb5b'::uuid, '0e7b38b1-aa96-49f4-8000-4d937f184d71'::uuid, '201325a9-d4a7-4e81-acc0-607cab81ae69'::uuid, '42237aab-221f-42df-aee9-bfaf7143fbf8'::uuid, '45cabc0f-549b-4a3c-8107-a3e1e9a23a09'::uuid, '67a3fd1c-ac71-43a5-9859-7076c3bb6f86'::uuid, 'a64ff9d3-5791-4b8b-b6be-77fb6ff19c7f'::uuid, 'aeae6786-cff7-4547-bf7e-51978fb72ea7'::uuid, 'bb412add-043a-415c-876c-b0f66c7b8962'::uuid, 'ec5946ef-a017-4b5a-9f73-010043498986'::uuid)
)
INSERT INTO public.questions (
    quiz_id,
    bank_question_id,
    order_index,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    title,
    weight,
    hint,
    time_limit,
    per_option_explanations,
    video_url,
    model_3d_url,
    hotspot_data,
    matching_pairs,
    sequence_items,
    fill_blank_template,
    numerical_answer,
    numerical_tolerance,
    question_image_url,
    option_images,
    media_type,
    media_url,
    topic
)
SELECT 
    new_quiz.id,
    rb.bank_id,
    rb.row_num,
    rb.question_text,
    COALESCE(rb.question_type, 'multiple_choice'),
    rb.options,
    rb.correct_answer,
    rb.explanation,
    rb.q_title,
    COALESCE(rb.weight, 1.0),
    rb.hint,
    rb.time_limit,
    rb.per_option_explanations,
    rb.video_url,
    rb.model_3d_url,
    rb.hotspot_data,
    rb.matching_pairs,
    rb.sequence_items,
    rb.fill_blank_template,
    rb.numerical_answer,
    rb.numerical_tolerance,
    rb.question_image_url,
    rb.option_images,
    rb.media_type,
    rb.media_url,
    rb.topic
FROM ranked_bank rb
CROSS JOIN new_quiz;


-- ========================================================
-- Quiz: Respublika Fənn Olimpiadası (X sinif) — Riyaziyyat (20 sual)
-- ========================================================
WITH new_quiz AS (
    INSERT INTO public.quizzes (
        creator_id,
        title,
        description,
        subject,
        grade,
        difficulty,
        duration,
        is_public,
        is_published,
        pass_percentage,
        access_password,
        exam_category,
        allow_backtracking,
        show_question_nav,
        questions_per_page,
        feedback_timing,
        show_feedback,
        shuffle_questions
    ) VALUES (
        '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
        'Respublika Fənn Olimpiadası (X sinif) — Riyaziyyat',
        '10-cu sinif şagirdləri üçün Riyaziyyat fənni üzrə olimpiada sınaq imtahanı (20 sual).',
        'Riyaziyyat',
        '10',
        'medium',
        40,
        true,
        true,
        60,
        'parol',
        'Olimpiada',
        true,
        true,
        1,
        'end_of_quiz',
        true,
        false
    )
    RETURNING id
),
ranked_bank AS (
    SELECT 
        qb.id AS bank_id,
        qb.question_text,
        qb.question_type,
        qb.options,
        qb.correct_answer,
        qb.explanation,
        qb.title AS q_title,
        qb.weight,
        qb.hint,
        qb.time_limit,
        qb.per_option_explanations,
        qb.video_url,
        qb.model_3d_url,
        qb.hotspot_data,
        qb.matching_pairs,
        qb.sequence_items,
        qb.fill_blank_template,
        qb.numerical_answer,
        qb.numerical_tolerance,
        qb.question_image_url,
        qb.option_images,
        qb.media_type,
        qb.media_url,
        qb.category AS topic,
        ROW_NUMBER() OVER (ORDER BY qb.created_at ASC, qb.id ASC) AS row_num
    FROM public.question_bank qb
    WHERE qb.id IN ('2359e832-e5f4-4706-8061-30d1eff29800'::uuid, '416f8d14-3354-4788-9331-3a234189bc0d'::uuid, '6485de89-209f-4ba0-9b05-7dd312f0c8fd'::uuid, 'bc53b2a4-170c-401c-b4e2-af9f2168909b'::uuid, 'da2cf667-6e01-42bf-ad8d-358d649bc3a9'::uuid, '0543bcf7-e2be-4623-91d7-8faef1630f75'::uuid, '09f07d9e-5c84-4b31-9e5c-bdde5324fb13'::uuid, '0a38ee17-5b1f-44ef-a1bb-a5b0d5f193fa'::uuid, '180c3d8b-958e-443e-a82a-866c42101746'::uuid, '1c2e2151-5025-4a52-b3d6-0ac3905d7ed0'::uuid, '36e8ff7c-f117-4ae3-bf3d-a3f8633e2630'::uuid, '422d1433-f18c-415f-a678-5ed1c285f15a'::uuid, '5527f1ea-3a67-4320-9c48-32bac1d66897'::uuid, '6cc52470-23e9-4ef9-910c-ba35df93b14f'::uuid, '806bc61d-7b81-43e6-91ef-a9164f40ded3'::uuid, '81b2b0c0-0dcc-4727-92bb-153a2f80f6de'::uuid, 'a9738e67-687f-41d2-89ca-ae217665910b'::uuid, 'a9e5fe9e-10e7-4dc3-8f8b-be781b23a97f'::uuid, 'f45ea44e-4b0d-430d-a375-1e197a71a76e'::uuid, 'fadb0912-82f5-4099-ab17-2b951fa556c3'::uuid)
)
INSERT INTO public.questions (
    quiz_id,
    bank_question_id,
    order_index,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    title,
    weight,
    hint,
    time_limit,
    per_option_explanations,
    video_url,
    model_3d_url,
    hotspot_data,
    matching_pairs,
    sequence_items,
    fill_blank_template,
    numerical_answer,
    numerical_tolerance,
    question_image_url,
    option_images,
    media_type,
    media_url,
    topic
)
SELECT 
    new_quiz.id,
    rb.bank_id,
    rb.row_num,
    rb.question_text,
    COALESCE(rb.question_type, 'multiple_choice'),
    rb.options,
    rb.correct_answer,
    rb.explanation,
    rb.q_title,
    COALESCE(rb.weight, 1.0),
    rb.hint,
    rb.time_limit,
    rb.per_option_explanations,
    rb.video_url,
    rb.model_3d_url,
    rb.hotspot_data,
    rb.matching_pairs,
    rb.sequence_items,
    rb.fill_blank_template,
    rb.numerical_answer,
    rb.numerical_tolerance,
    rb.question_image_url,
    rb.option_images,
    rb.media_type,
    rb.media_url,
    rb.topic
FROM ranked_bank rb
CROSS JOIN new_quiz;


-- ========================================================
-- Quiz: Respublika Fənn Olimpiadası (X sinif) — Fizika (20 sual)
-- ========================================================
WITH new_quiz AS (
    INSERT INTO public.quizzes (
        creator_id,
        title,
        description,
        subject,
        grade,
        difficulty,
        duration,
        is_public,
        is_published,
        pass_percentage,
        access_password,
        exam_category,
        allow_backtracking,
        show_question_nav,
        questions_per_page,
        feedback_timing,
        show_feedback,
        shuffle_questions
    ) VALUES (
        '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
        'Respublika Fənn Olimpiadası (X sinif) — Fizika',
        '10-cu sinif şagirdləri üçün Fizika fənni üzrə olimpiada sınaq imtahanı (20 sual).',
        'Fizika',
        '10',
        'medium',
        40,
        true,
        true,
        60,
        'parol',
        'Olimpiada',
        true,
        true,
        1,
        'end_of_quiz',
        true,
        false
    )
    RETURNING id
),
ranked_bank AS (
    SELECT 
        qb.id AS bank_id,
        qb.question_text,
        qb.question_type,
        qb.options,
        qb.correct_answer,
        qb.explanation,
        qb.title AS q_title,
        qb.weight,
        qb.hint,
        qb.time_limit,
        qb.per_option_explanations,
        qb.video_url,
        qb.model_3d_url,
        qb.hotspot_data,
        qb.matching_pairs,
        qb.sequence_items,
        qb.fill_blank_template,
        qb.numerical_answer,
        qb.numerical_tolerance,
        qb.question_image_url,
        qb.option_images,
        qb.media_type,
        qb.media_url,
        qb.category AS topic,
        ROW_NUMBER() OVER (ORDER BY qb.created_at ASC, qb.id ASC) AS row_num
    FROM public.question_bank qb
    WHERE qb.id IN ('2aaa9201-572f-45e6-a698-f7f028260b6c'::uuid, '3e217b7e-92f1-4abc-8a58-8e7f13cb3544'::uuid, '45391962-4976-41c7-8e69-02659fc6b14d'::uuid, '613cea7a-a5f5-4e9c-8e8f-a3d36cd4ce97'::uuid, '73de34f7-449c-4c7f-bd5d-741fc523de17'::uuid, '77139fab-ef82-4e8b-a304-eeb07ab304e0'::uuid, '7dfe2c85-1add-4409-8141-475c2c4101e9'::uuid, 'd05c5dd6-c237-4565-a16b-8cd66897692d'::uuid, 'e5693d3e-acbf-4657-9d2f-29f9cce3edb7'::uuid, 'f4c7103b-215b-4ce2-8869-e17eb3cb294b'::uuid, '01577712-ccde-4608-8efb-3eb47c53b493'::uuid, '0e26b38b-a318-4118-9ca1-4109e04c40ba'::uuid, '1388b8d1-954c-4ac5-bfcd-94d1f8b27c1b'::uuid, '2a2e17fa-d6d3-4034-876e-23523b96f728'::uuid, '3c13ce8a-cdb6-45a4-aec9-18ed370b5241'::uuid, '3f343fa6-deea-4b47-99d8-42bf44edfcb9'::uuid, 'a5a202d1-0b52-447f-8a59-4b48dbcbcfd0'::uuid, 'adb97065-368b-4cde-b467-117f497b0d33'::uuid, 'bac59286-dfa7-4294-8b20-fbee19f2c9a2'::uuid, 'f7faf3e1-bd2a-41c9-9eed-a915a1b7445d'::uuid)
)
INSERT INTO public.questions (
    quiz_id,
    bank_question_id,
    order_index,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    title,
    weight,
    hint,
    time_limit,
    per_option_explanations,
    video_url,
    model_3d_url,
    hotspot_data,
    matching_pairs,
    sequence_items,
    fill_blank_template,
    numerical_answer,
    numerical_tolerance,
    question_image_url,
    option_images,
    media_type,
    media_url,
    topic
)
SELECT 
    new_quiz.id,
    rb.bank_id,
    rb.row_num,
    rb.question_text,
    COALESCE(rb.question_type, 'multiple_choice'),
    rb.options,
    rb.correct_answer,
    rb.explanation,
    rb.q_title,
    COALESCE(rb.weight, 1.0),
    rb.hint,
    rb.time_limit,
    rb.per_option_explanations,
    rb.video_url,
    rb.model_3d_url,
    rb.hotspot_data,
    rb.matching_pairs,
    rb.sequence_items,
    rb.fill_blank_template,
    rb.numerical_answer,
    rb.numerical_tolerance,
    rb.question_image_url,
    rb.option_images,
    rb.media_type,
    rb.media_url,
    rb.topic
FROM ranked_bank rb
CROSS JOIN new_quiz;


-- ========================================================
-- Quiz: Respublika Fənn Olimpiadası (X sinif) — Kimya (20 sual)
-- ========================================================
WITH new_quiz AS (
    INSERT INTO public.quizzes (
        creator_id,
        title,
        description,
        subject,
        grade,
        difficulty,
        duration,
        is_public,
        is_published,
        pass_percentage,
        access_password,
        exam_category,
        allow_backtracking,
        show_question_nav,
        questions_per_page,
        feedback_timing,
        show_feedback,
        shuffle_questions
    ) VALUES (
        '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
        'Respublika Fənn Olimpiadası (X sinif) — Kimya',
        '10-cu sinif şagirdləri üçün Kimya fənni üzrə olimpiada sınaq imtahanı (20 sual).',
        'Kimya',
        '10',
        'medium',
        40,
        true,
        true,
        60,
        'parol',
        'Olimpiada',
        true,
        true,
        1,
        'end_of_quiz',
        true,
        false
    )
    RETURNING id
),
ranked_bank AS (
    SELECT 
        qb.id AS bank_id,
        qb.question_text,
        qb.question_type,
        qb.options,
        qb.correct_answer,
        qb.explanation,
        qb.title AS q_title,
        qb.weight,
        qb.hint,
        qb.time_limit,
        qb.per_option_explanations,
        qb.video_url,
        qb.model_3d_url,
        qb.hotspot_data,
        qb.matching_pairs,
        qb.sequence_items,
        qb.fill_blank_template,
        qb.numerical_answer,
        qb.numerical_tolerance,
        qb.question_image_url,
        qb.option_images,
        qb.media_type,
        qb.media_url,
        qb.category AS topic,
        ROW_NUMBER() OVER (ORDER BY qb.created_at ASC, qb.id ASC) AS row_num
    FROM public.question_bank qb
    WHERE qb.id IN ('03258de3-1e77-43e4-9ca0-526bf3161572'::uuid, '23b4f91f-53e9-4ab0-a64a-4c343d71f72c'::uuid, '3c203cdc-4ccb-48c0-9366-de23334e6f06'::uuid, '4f1f2259-2d29-491d-8043-47095d0efa16'::uuid, '68ed91cf-16b6-4469-8a92-850f12d341ea'::uuid, '8b008880-4cca-4bf1-921c-82420398fe9b'::uuid, '91062a34-e270-4921-86d7-52afb04d6e74'::uuid, 'a806ccf0-2ac9-436f-96de-5a440da763b6'::uuid, 'b2ece4cb-3c3b-4491-a053-60b7ac68fbc4'::uuid, 'bde4fdba-309b-42b5-a64b-a118fa05ba2c'::uuid, 'be00945f-a464-438e-9dfe-c2bb6887aacb'::uuid, 'd18997a0-2677-49ec-b4a1-5599ad29ff28'::uuid, 'db9b8ac0-2bf1-48e4-b968-0205a26dc927'::uuid, 'e0836d61-0a49-43d6-aede-54e68ba7e6c5'::uuid, 'e6647d74-956b-4672-ace5-f4e8e8d09af8'::uuid, '49db90b4-ae13-47c4-baae-f6a4f768d230'::uuid, '7e13ba33-2463-4960-abb0-c83d55a450d9'::uuid, '8c259601-815e-4e9e-a4fb-ba9143e6fc41'::uuid, 'bd13cec1-cc36-4b93-9513-36ea13c5329d'::uuid, 'f7512699-b99d-4a11-8cc6-5e073d9a5b33'::uuid)
)
INSERT INTO public.questions (
    quiz_id,
    bank_question_id,
    order_index,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    title,
    weight,
    hint,
    time_limit,
    per_option_explanations,
    video_url,
    model_3d_url,
    hotspot_data,
    matching_pairs,
    sequence_items,
    fill_blank_template,
    numerical_answer,
    numerical_tolerance,
    question_image_url,
    option_images,
    media_type,
    media_url,
    topic
)
SELECT 
    new_quiz.id,
    rb.bank_id,
    rb.row_num,
    rb.question_text,
    COALESCE(rb.question_type, 'multiple_choice'),
    rb.options,
    rb.correct_answer,
    rb.explanation,
    rb.q_title,
    COALESCE(rb.weight, 1.0),
    rb.hint,
    rb.time_limit,
    rb.per_option_explanations,
    rb.video_url,
    rb.model_3d_url,
    rb.hotspot_data,
    rb.matching_pairs,
    rb.sequence_items,
    rb.fill_blank_template,
    rb.numerical_answer,
    rb.numerical_tolerance,
    rb.question_image_url,
    rb.option_images,
    rb.media_type,
    rb.media_url,
    rb.topic
FROM ranked_bank rb
CROSS JOIN new_quiz;


-- ========================================================
-- Quiz: Respublika Fənn Olimpiadası (X sinif) — Biologiya (20 sual)
-- ========================================================
WITH new_quiz AS (
    INSERT INTO public.quizzes (
        creator_id,
        title,
        description,
        subject,
        grade,
        difficulty,
        duration,
        is_public,
        is_published,
        pass_percentage,
        access_password,
        exam_category,
        allow_backtracking,
        show_question_nav,
        questions_per_page,
        feedback_timing,
        show_feedback,
        shuffle_questions
    ) VALUES (
        '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
        'Respublika Fənn Olimpiadası (X sinif) — Biologiya',
        '10-cu sinif şagirdləri üçün Biologiya fənni üzrə olimpiada sınaq imtahanı (20 sual).',
        'Biologiya',
        '10',
        'medium',
        40,
        true,
        true,
        60,
        'parol',
        'Olimpiada',
        true,
        true,
        1,
        'end_of_quiz',
        true,
        false
    )
    RETURNING id
),
ranked_bank AS (
    SELECT 
        qb.id AS bank_id,
        qb.question_text,
        qb.question_type,
        qb.options,
        qb.correct_answer,
        qb.explanation,
        qb.title AS q_title,
        qb.weight,
        qb.hint,
        qb.time_limit,
        qb.per_option_explanations,
        qb.video_url,
        qb.model_3d_url,
        qb.hotspot_data,
        qb.matching_pairs,
        qb.sequence_items,
        qb.fill_blank_template,
        qb.numerical_answer,
        qb.numerical_tolerance,
        qb.question_image_url,
        qb.option_images,
        qb.media_type,
        qb.media_url,
        qb.category AS topic,
        ROW_NUMBER() OVER (ORDER BY qb.created_at ASC, qb.id ASC) AS row_num
    FROM public.question_bank qb
    WHERE qb.id IN ('09a32138-4072-4591-8081-7c5a1b6159b1'::uuid, '1501c960-1e8e-4ae3-aad4-0e255ef14685'::uuid, '1be2b766-163e-478a-94eb-cff281413658'::uuid, '3497f3cb-64ee-413f-84ba-92f603573e29'::uuid, '3a4c1ffc-6f2c-4ead-839f-9f0d6906f944'::uuid, '3d78f679-b872-4185-8979-c11e4879b734'::uuid, '6c07deae-6e2f-4d2c-9586-277260a1c62b'::uuid, '7256e249-1796-41cd-a35a-9d06f2c02b3b'::uuid, '7423adf7-18de-463d-8bea-492c4f09c05c'::uuid, '787ed45c-a805-4481-84be-3710fd1a5064'::uuid, '7cc9b96c-296f-45da-bdda-83dcfe49ed93'::uuid, '82e373aa-3e55-45c1-946e-b9cf78b0e90f'::uuid, '89bf036d-b870-4776-8d70-f63ec9a6d6af'::uuid, 'b171cecb-7d66-4b37-acc8-5b60e655fedc'::uuid, 'b2f11369-3a26-4e2a-8c8d-411477445056'::uuid, 'b6a48222-7f7d-4b62-adac-94540db9977e'::uuid, 'b8d65e0f-5faa-4966-a0be-4b8ee6ac31ec'::uuid, 'c1b5103b-f8de-46b1-9fe9-e37fe2a5934c'::uuid, 'c9ba1660-2e0d-468f-b001-5146ea08329e'::uuid, 'd6f34c39-b7cc-4070-bb89-a51bf9bd9c25'::uuid)
)
INSERT INTO public.questions (
    quiz_id,
    bank_question_id,
    order_index,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    title,
    weight,
    hint,
    time_limit,
    per_option_explanations,
    video_url,
    model_3d_url,
    hotspot_data,
    matching_pairs,
    sequence_items,
    fill_blank_template,
    numerical_answer,
    numerical_tolerance,
    question_image_url,
    option_images,
    media_type,
    media_url,
    topic
)
SELECT 
    new_quiz.id,
    rb.bank_id,
    rb.row_num,
    rb.question_text,
    COALESCE(rb.question_type, 'multiple_choice'),
    rb.options,
    rb.correct_answer,
    rb.explanation,
    rb.q_title,
    COALESCE(rb.weight, 1.0),
    rb.hint,
    rb.time_limit,
    rb.per_option_explanations,
    rb.video_url,
    rb.model_3d_url,
    rb.hotspot_data,
    rb.matching_pairs,
    rb.sequence_items,
    rb.fill_blank_template,
    rb.numerical_answer,
    rb.numerical_tolerance,
    rb.question_image_url,
    rb.option_images,
    rb.media_type,
    rb.media_url,
    rb.topic
FROM ranked_bank rb
CROSS JOIN new_quiz;


-- ========================================================
-- Quiz: Respublika Fənn Olimpiadası (X sinif) — Tarix (20 sual)
-- ========================================================
WITH new_quiz AS (
    INSERT INTO public.quizzes (
        creator_id,
        title,
        description,
        subject,
        grade,
        difficulty,
        duration,
        is_public,
        is_published,
        pass_percentage,
        access_password,
        exam_category,
        allow_backtracking,
        show_question_nav,
        questions_per_page,
        feedback_timing,
        show_feedback,
        shuffle_questions
    ) VALUES (
        '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
        'Respublika Fənn Olimpiadası (X sinif) — Tarix',
        '10-cu sinif şagirdləri üçün Tarix fənni üzrə olimpiada sınaq imtahanı (20 sual).',
        'Tarix',
        '10',
        'medium',
        40,
        true,
        true,
        60,
        'parol',
        'Olimpiada',
        true,
        true,
        1,
        'end_of_quiz',
        true,
        false
    )
    RETURNING id
),
ranked_bank AS (
    SELECT 
        qb.id AS bank_id,
        qb.question_text,
        qb.question_type,
        qb.options,
        qb.correct_answer,
        qb.explanation,
        qb.title AS q_title,
        qb.weight,
        qb.hint,
        qb.time_limit,
        qb.per_option_explanations,
        qb.video_url,
        qb.model_3d_url,
        qb.hotspot_data,
        qb.matching_pairs,
        qb.sequence_items,
        qb.fill_blank_template,
        qb.numerical_answer,
        qb.numerical_tolerance,
        qb.question_image_url,
        qb.option_images,
        qb.media_type,
        qb.media_url,
        qb.category AS topic,
        ROW_NUMBER() OVER (ORDER BY qb.created_at ASC, qb.id ASC) AS row_num
    FROM public.question_bank qb
    WHERE qb.id IN ('1913aafb-0a5d-41ef-8249-d77c620731a1'::uuid, '6bc1804c-077d-4c38-a6d3-d7f08565ab0b'::uuid, 'bf1fb03d-4138-49ae-8a74-1a2a5cda1da3'::uuid, 'c0f45cc8-6316-4961-8e37-9d396da294f2'::uuid, 'd43cd113-c5ee-48a5-adca-9d127db992a1'::uuid, '0903ca78-5a3a-4064-9641-170b3cc8f164'::uuid, '0f2c019d-6dd9-4388-beee-bd3781b7ef1e'::uuid, '16251738-6f32-42ab-a3ea-3d36b8bb22d5'::uuid, '25503c13-6094-482c-ac3a-8568b94b4906'::uuid, '43e9aef2-ad20-41cc-8f96-7e1a46b7fbde'::uuid, '4af859bc-4b59-4453-aeb8-4338f092932e'::uuid, '73213ab9-5441-408e-86cb-a0919f4618e7'::uuid, '809887f0-4bce-4014-9c29-499374f1453d'::uuid, '83620c8d-030b-47a2-930f-dc84e4581540'::uuid, '896a08aa-79a3-45be-a5f0-a1ef55e6849e'::uuid, '92358dc5-af31-430f-be36-82386e957dce'::uuid, '9e29f8a7-2401-4345-8167-c43be1d85daf'::uuid, 'ab4e5fba-d8c7-460b-a615-982d7b181f7e'::uuid, 'e382a4be-2c1a-44e1-a526-321cb94eef92'::uuid, 'e5577abc-0e0b-41c5-9a50-ae30f13c74b1'::uuid)
)
INSERT INTO public.questions (
    quiz_id,
    bank_question_id,
    order_index,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    title,
    weight,
    hint,
    time_limit,
    per_option_explanations,
    video_url,
    model_3d_url,
    hotspot_data,
    matching_pairs,
    sequence_items,
    fill_blank_template,
    numerical_answer,
    numerical_tolerance,
    question_image_url,
    option_images,
    media_type,
    media_url,
    topic
)
SELECT 
    new_quiz.id,
    rb.bank_id,
    rb.row_num,
    rb.question_text,
    COALESCE(rb.question_type, 'multiple_choice'),
    rb.options,
    rb.correct_answer,
    rb.explanation,
    rb.q_title,
    COALESCE(rb.weight, 1.0),
    rb.hint,
    rb.time_limit,
    rb.per_option_explanations,
    rb.video_url,
    rb.model_3d_url,
    rb.hotspot_data,
    rb.matching_pairs,
    rb.sequence_items,
    rb.fill_blank_template,
    rb.numerical_answer,
    rb.numerical_tolerance,
    rb.question_image_url,
    rb.option_images,
    rb.media_type,
    rb.media_url,
    rb.topic
FROM ranked_bank rb
CROSS JOIN new_quiz;


-- ========================================================
-- Quiz: Respublika Fənn Olimpiadası (X sinif) — Coğrafiya (20 sual)
-- ========================================================
WITH new_quiz AS (
    INSERT INTO public.quizzes (
        creator_id,
        title,
        description,
        subject,
        grade,
        difficulty,
        duration,
        is_public,
        is_published,
        pass_percentage,
        access_password,
        exam_category,
        allow_backtracking,
        show_question_nav,
        questions_per_page,
        feedback_timing,
        show_feedback,
        shuffle_questions
    ) VALUES (
        '81cebd9d-586b-4460-8615-6cb0ed9d1094'::uuid,
        'Respublika Fənn Olimpiadası (X sinif) — Coğrafiya',
        '10-cu sinif şagirdləri üçün Coğrafiya fənni üzrə olimpiada sınaq imtahanı (20 sual).',
        'Coğrafiya',
        '10',
        'medium',
        40,
        true,
        true,
        60,
        'parol',
        'Olimpiada',
        true,
        true,
        1,
        'end_of_quiz',
        true,
        false
    )
    RETURNING id
),
ranked_bank AS (
    SELECT 
        qb.id AS bank_id,
        qb.question_text,
        qb.question_type,
        qb.options,
        qb.correct_answer,
        qb.explanation,
        qb.title AS q_title,
        qb.weight,
        qb.hint,
        qb.time_limit,
        qb.per_option_explanations,
        qb.video_url,
        qb.model_3d_url,
        qb.hotspot_data,
        qb.matching_pairs,
        qb.sequence_items,
        qb.fill_blank_template,
        qb.numerical_answer,
        qb.numerical_tolerance,
        qb.question_image_url,
        qb.option_images,
        qb.media_type,
        qb.media_url,
        qb.category AS topic,
        ROW_NUMBER() OVER (ORDER BY qb.created_at ASC, qb.id ASC) AS row_num
    FROM public.question_bank qb
    WHERE qb.id IN ('038b486f-2b21-43d2-b895-588da757b45b'::uuid, '0ad163a6-9357-44a9-9754-166bad9e8875'::uuid, '10baa093-36d9-45e6-992b-33b2256f1ed4'::uuid, '1589932c-24b9-443e-9622-b7541a703f98'::uuid, '1bcb0b56-7ba4-4015-9f9e-1afa76fac124'::uuid, '1f0c20c9-d381-44e4-a5da-9a59a96d0d3a'::uuid, '4807bb3b-ef0f-49c4-9a3d-c0088d4b2d6a'::uuid, '4a479d63-4870-4bbe-a2c6-61823aee0bf5'::uuid, '565f3ae5-8a14-4bbb-8332-e28aedf7a9b4'::uuid, '7b88bd8a-4d35-455d-8365-b536b80759ce'::uuid, '9a40ca54-e764-4b0d-9757-60b616335a63'::uuid, 'b160abad-6c8d-459e-9f8a-032031cd293a'::uuid, 'c0209096-4d8b-487a-be08-0247d6f4ea4f'::uuid, 'c8307e9a-187e-4b81-9763-1af7ddc77b6f'::uuid, 'cda8debe-4136-48fa-8631-f4320bdffcbe'::uuid, 'd267cd55-c1c2-4591-ab0e-85b08d7b2a5b'::uuid, 'e655717e-302b-4dd2-98b7-5d0e54c7b9ca'::uuid, 'ef87a0eb-e385-45f4-adfa-576f73d3f5c1'::uuid, 'f98b839f-7379-4c3c-928c-d35c5b629e00'::uuid, 'faad3b61-dda2-422f-b198-0f13f1c3ddc7'::uuid)
)
INSERT INTO public.questions (
    quiz_id,
    bank_question_id,
    order_index,
    question_text,
    question_type,
    options,
    correct_answer,
    explanation,
    title,
    weight,
    hint,
    time_limit,
    per_option_explanations,
    video_url,
    model_3d_url,
    hotspot_data,
    matching_pairs,
    sequence_items,
    fill_blank_template,
    numerical_answer,
    numerical_tolerance,
    question_image_url,
    option_images,
    media_type,
    media_url,
    topic
)
SELECT 
    new_quiz.id,
    rb.bank_id,
    rb.row_num,
    rb.question_text,
    COALESCE(rb.question_type, 'multiple_choice'),
    rb.options,
    rb.correct_answer,
    rb.explanation,
    rb.q_title,
    COALESCE(rb.weight, 1.0),
    rb.hint,
    rb.time_limit,
    rb.per_option_explanations,
    rb.video_url,
    rb.model_3d_url,
    rb.hotspot_data,
    rb.matching_pairs,
    rb.sequence_items,
    rb.fill_blank_template,
    rb.numerical_answer,
    rb.numerical_tolerance,
    rb.question_image_url,
    rb.option_images,
    rb.media_type,
    rb.media_url,
    rb.topic
FROM ranked_bank rb
CROSS JOIN new_quiz;

COMMIT;